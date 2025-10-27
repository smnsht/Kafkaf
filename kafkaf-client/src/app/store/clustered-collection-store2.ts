import { BehaviorSubject, Observable, startWith, pairwise } from 'rxjs';
import { BaseCollectionState, BaseCollectionStore } from './base-collection-store';
import { ParamMap } from '@angular/router';
import { computed, signal, WritableSignal } from '@angular/core';

type MaybeString = string | null | undefined;

export abstract class ClusteredDataCollectionStore2<T> extends BaseCollectionStore<T> {
  protected readonly initialState: BaseCollectionState<T>;
  protected readonly secondParam = signal<MaybeString>(undefined);
  protected readonly cacheKey$ = new BehaviorSubject<MaybeString>(null);
  protected readonly secondParamName: string;
  protected readonly clusteredData: Map<string, BaseCollectionState<T>>;
  protected readonly clusterIdx: WritableSignal<number>;

  protected readonly prevAndCurrent$: Observable<[MaybeString, MaybeString]> = this.cacheKey$.pipe(
    startWith(null),
    pairwise(),
  );

  readonly clusterIndex = computed(() => this.clusterIdx());

  constructor(initialState: BaseCollectionState<T>, secondParamName: string) {
    super(initialState);

    this.initialState = initialState;
    this.secondParamName = secondParamName;
    this.clusteredData = new Map();
    this.clusterIdx = signal(Number.NaN);
    this.prevAndCurrent$.subscribe(this.handlePrevAndCurrentCluster.bind(this));
  }

  handleParamMapChange(params: ParamMap): string {
    const cluster = Number.parseInt(params.get('cluster')!);
    const second = params.get(this.secondParamName);

    if (!second) {
      this.logger.error(`Can't obtain route param ${this.secondParamName}. Params: ${params}`);
      return '';
    }

    this.clusterIdx.set(cluster);
    this.secondParam.set(second);

    const key = `${cluster}/${second}`;

    this.cacheKey$.next(key);
    return key;
  }

  private handlePrevAndCurrentCluster(value: [MaybeString, MaybeString]): void {
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
