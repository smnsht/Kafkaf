import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

export interface BaseState<T> {
  itemsMap: Map<number, T>;
  clusterIdx: number;
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}

export interface PageState {
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}

export type ItemIdPK = string | number;

@Injectable()
export abstract class BaseStore<T> {
  protected abstract resourceUrl(clusterIdx: number): string;
  protected abstract resourceItemUrl(clusterIdx: number, itemId: ItemIdPK): string;

  protected readonly http = inject(HttpClient);
  protected readonly state = signal<BaseState<T>>({
    itemsMap: new Map<number, T>(),
    clusterIdx: NaN,
  });

  readonly itemsMap = computed(() => this.state().itemsMap);
  readonly clusterIdx = computed(() => this.state().clusterIdx);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly notice = computed(() => this.state().notice);

  readonly keys = computed(() => Array.from(this.state().itemsMap.keys()));

  readonly pageState = computed<PageState>(() => {
    const { loading, error, notice } = this.state();
    return { loading, error, notice };
  });

  readonly currentItems = computed(() => {
    const { itemsMap, clusterIdx } = this.state();
    return itemsMap.get(clusterIdx);
  });

  setLoading(loading: boolean): void {
    this.state.update((state) => ({
      ...state,
      loading,
    }));
  }

  setError(error?: string): void {
    this.state.update((state) => ({
      ...state,
      error,
      loading: false,
    }));
  }

  setNotice(notice?: string): void {
    this.state.update((state) => ({
      ...state,
      notice,
    }));
  }

  setPageState(pageState: PageState): void {
    this.state.update((state) => ({
      ...state,
      ...pageState,
    }));
  }

  selectCluster(clusterIdx: number): void {
    if (clusterIdx >= 0) {
      this.state.update((state) => ({
        ...state,
        clusterIdx,
      }));
    }
  }

  loadCollection(clusterIdx: number): boolean {
    const keys = Array.from(this.state().itemsMap.keys());

    if (clusterIdx >= 0 && !keys.includes(clusterIdx)) {
      this.state.update((state) => ({
        ...state,
        loading: true,
        error: undefined,
        clusterIdx,
      }));

      this.fetchItems(clusterIdx);
      return true;
    }

    this.selectCluster(clusterIdx);
    return false;
  }

  protected fetchItems(clusterIdx: number): void {
    this.setPageState({
      loading: true,
      error: undefined,
      notice: undefined,
    });

    const url = this.resourceUrl(clusterIdx);

    this.http.get<T>(url).subscribe({
      next: (data) => {
        this.state.update((state) => {
          const { itemsMap } = state;
          itemsMap.set(clusterIdx, data);
          return {
            ...state,
            itemsMap,
            clusterIdx,
            loading: false,
          };
        });
      },
      error: (err: HttpErrorResponse) => {
        this.setPageState({
          loading: false,
          error: err.message,
          notice: undefined,
        });
      },
    });
  }
}
