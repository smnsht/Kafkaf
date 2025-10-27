import { BehaviorSubject, Observable, startWith, pairwise } from 'rxjs';
import { BaseCollectionState, BaseCollectionStore } from './base-collection-store';
import { computed, effect, inject } from '@angular/core';
import { RootStore } from './root/root.service';
import { MaybeString } from './clusters/cluster-info.model';
import { environment } from 'environments/environment';

export abstract class SectionedDataCollectionStore<T> extends BaseCollectionStore<T> {
  protected readonly rootStore = inject(RootStore);
  protected readonly initialState: BaseCollectionState<T>;
  protected readonly clusteredData: Map<string, BaseCollectionState<T>>;

  // holds the current cache key, comprised of $clusterIdx/$kafkaSectionValue
  protected readonly cacheKey$ = new BehaviorSubject<MaybeString>(null);

  // expose prev/current as a combined stream
  protected readonly prevAndCurrent$: Observable<[MaybeString, MaybeString]> = this.cacheKey$.pipe(
    startWith(null),
    pairwise(),
  );

  readonly clusterIndex = computed(() => this.rootStore.clusterIndex());
  readonly kafkaSection = computed(() => this.rootStore.kafkaSection());
  readonly kafkaSectionValue = computed(() => this.rootStore.kafkaSectionValue());

  constructor(initialState: BaseCollectionState<T>) {
    super(initialState);

    this.initialState = initialState;
    this.clusteredData = new Map();

    effect(() => {
      const clusterIndex = this.clusterIndex();
      const kafkaSectionValue = this.kafkaSectionValue();

      if (Number.isInteger(clusterIndex) && kafkaSectionValue) {
        this.cacheKey$.next(`${clusterIndex}/${kafkaSectionValue}`);
      }
    });

    this.prevAndCurrent$.subscribe(this.handlePrevAndCurrentSection.bind(this));
  }

  getResourceUrl(): string {
    return [
      `${environment.apiUrl}/clusters`,
      this.rootStore.clusterIndex(),
      this.rootStore.kafkaSection(),
      this.rootStore.kafkaSectionValue(),
    ].join('/');
  }

  private handlePrevAndCurrentSection(value: [MaybeString, MaybeString]): void {
    const [previous, current] = value;

    if (previous === current) {
      return;
    }

    if (previous) {
      this.clusteredData.set(previous, this.state());
      this.state.set(this.initialState);
    }

    if (!current) {
      return;
    }

    const currentState = this.clusteredData.get(current);

    if (currentState) {
      this.state.set(currentState);
    }
  }
}
