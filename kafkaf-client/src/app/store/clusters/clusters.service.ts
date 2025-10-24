import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';
import { ClusterInfo, tKafkaSection } from './cluster-info.model';

@Injectable({
  providedIn: 'root',
})
export class ClustersStore {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  clusters = signal<ClusterInfo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  clusterIndex = signal<number>(Number.NaN);
  kafkaSection = signal<tKafkaSection>(null);

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.fetchClusters();
      }
    });

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const pathParts = event.urlAfterRedirects.split('/').filter(Boolean);

        const cluster =
          pathParts[0] === 'clusters' && !Number.isNaN(+pathParts[1]) ? +pathParts[1] : Number.NaN;

        const section = pathParts[2];
        const validSection: tKafkaSection | null =
          section === 'brokers' || section === 'topics' || section === 'consumers' ? section : null;

        this.clusterIndex.set(cluster);
        this.kafkaSection.set(validSection);
      });
  }

  public loadClustersInfo() {
    this.loading.set(true);
    this.error.set(null);
  }

  private fetchClusters(): void {
    const url = `${environment.apiUrl}/clusters`;

    this.http.get<ClusterInfo[]>(url).subscribe({
      next: (data) => {
        this.clusters.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.message);
      },
    });
  }
}
