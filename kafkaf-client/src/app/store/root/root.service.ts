import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MaybeString, tKafkaSection } from '../clusters/cluster-info.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RootStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly clusterIndex = signal<number>(Number.NaN);
  readonly kafkaSection = signal<tKafkaSection>(null);
  readonly kafkaSectionValue = signal<MaybeString>(undefined);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const pathParts = event.urlAfterRedirects.split('/').filter(Boolean);

        this.clusterIndex.set(this.getCluster(pathParts));
        this.kafkaSection.set(this.getKafkaSection(pathParts));
        this.kafkaSectionValue.set(pathParts[3]);
      });
  }

  private getCluster(pathParts: string[]): number {
    return pathParts[0] === 'clusters' && !Number.isNaN(+pathParts[1]) ? +pathParts[1] : Number.NaN;
  }

  private getKafkaSection(pathParts: string[]): tKafkaSection | null {
    const section = pathParts[2];

    return section === 'brokers' || section === 'topics' || section === 'consumers'
      ? section
      : null;
  }
}
