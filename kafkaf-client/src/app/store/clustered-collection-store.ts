import { BehaviorSubject, Observable, startWith, pairwise } from 'rxjs';
import { BaseCollectionState, BaseCollectionStore } from './base-collection-store';
import { ParamMap } from '@angular/router';

export abstract class ClusteredDataCollectionStore<T> extends BaseCollectionStore<T> {
  protected readonly initialState: BaseCollectionState<T>;

  // holds the current cluster index
  protected readonly clusterIdx$ = new BehaviorSubject<number>(Number.NaN);

  // expose prev/current as a combined stream
  protected readonly prevAndCurrent$: Observable<[number, number]> = this.clusterIdx$.pipe(
    startWith(Number.NaN),
    pairwise(),
  );

  protected readonly clusteredData: Map<number, BaseCollectionState<T>>;

  constructor(initialState: BaseCollectionState<T>) {
    super(initialState);
    this.initialState = initialState;
    this.clusteredData = new Map();
    this.prevAndCurrent$.subscribe(this.handlePrevAndCurrentCluster.bind(this));
  }

  handleParamMapChange(params: ParamMap): number {
    const cluster = Number.parseInt(params.get('cluster')!);
    this.clusterIdx.set(cluster);
    this.clusterIdx$.next(cluster);
    return cluster;
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
