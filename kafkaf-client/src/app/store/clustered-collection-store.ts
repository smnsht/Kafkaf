import { BehaviorSubject, Observable, startWith, pairwise } from 'rxjs';
import { BaseCollectionState, BaseCollectionStore } from './base-collection-store';
import { computed, effect, inject } from '@angular/core';
import { RootStore } from './root/root.service';
import { environment } from 'environments/environment';

export abstract class ClusteredDataCollectionStore<T> extends BaseCollectionStore<T> {
  protected readonly rootStore = inject(RootStore);
  protected readonly initialState: BaseCollectionState<T>;
  protected readonly clusteredData: Map<number, BaseCollectionState<T>>;

  // holds the current cluster index
  public readonly clusterIdx$ = new BehaviorSubject<number>(Number.NaN);

  // expose prev/current as a combined stream
  protected readonly prevAndCurrent$: Observable<[number, number]> = this.clusterIdx$.pipe(
    startWith(Number.NaN),
    pairwise(),
  );

  readonly clusterIndex = computed(() => this.rootStore.clusterIndex());

  constructor(initialState: BaseCollectionState<T>) {
    super(initialState);

    this.initialState = initialState;
    this.clusteredData = new Map();
    this.prevAndCurrent$.subscribe(this.handlePrevAndCurrentCluster.bind(this));

    effect(() => {
      const clusterIndex = this.clusterIndex();
      this.clusterIdx$.next(clusterIndex);
    });
  }

  getBaseResourceUrl(): string {
    const clusterIdx = this.clusterIndex();

    if (Number.isNaN(clusterIdx)) {
      throw new Error('clusterIdx is NaN');
    }

    return `${environment.apiUrl}/clusters/${clusterIdx}`;
  }

  private handlePrevAndCurrentCluster(value: [number, number]): void {
    const [previous, current] = value;

    if (previous === current) {
      return;
    }

    if (Number.isInteger(previous)) {
      this.clusteredData.set(previous, this.state());
      this.state.set(this.initialState);
    }

    if (Number.isNaN(current)) {
      return;
    }

    const currentState = this.clusteredData.get(current);

    if (currentState) {
      this.state.set(currentState);
    }
  }
}
