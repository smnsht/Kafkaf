import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

export interface BaseState<T> {
  itemsMap: Map<number, T[]>;
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
  protected readonly http = inject(HttpClient);
  protected readonly state = signal<BaseState<T>>({
    itemsMap: new Map<number, T[]>(),
    clusterIdx: NaN,
  });

  // Abstract
  protected abstract resourceUrl(clusterIdx: number): string;
  protected abstract resourceItemUrl(clusterIdx: number, itemId: ItemIdPK): string;
  protected abstract getItemKey(item: T): string | number;

  // Common getters
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
        error: undefined,
        notice: undefined,
      }));
    }
  }

  loadCollection(): boolean {
    const keys = this.keys();
    const clusterIdx = this.clusterIdx();

    if (clusterIdx >= 0 && !keys.includes(clusterIdx)) {
      this.state.update((state) => ({
        ...state,
        loading: true,
        error: undefined,
        notice: undefined,
      }));
      this.fetchItems(clusterIdx);
      return true;
    }

    return false;
  }

  removeItem(itemId: ItemIdPK, reload = false, successNotice?: string): void {
    this.setPageState({ loading: true });
    this.deleteItem(this.clusterIdx(), itemId, reload, successNotice);
  }

  removeItems(ids: ItemIdPK[], reload = false): void {
    this.setPageState({ loading: true });
    this.deleteMany(this.clusterIdx(), ids, reload);
  }

  protected fetchItems(clusterIdx: number): void {
    const url = this.resourceUrl(clusterIdx);

    this.http.get<T[]>(url).subscribe({
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
        this.setPageState({ loading: false, error: err.message });
      },
    });
  }

  protected deleteItem(
    clusterIdx: number,
    itemId: string | number,
    reload = false,
    successNotice: string = 'Item deleted successfully'
  ): void {
    const url = this.resourceItemUrl(clusterIdx, itemId);

    this.http.delete<void>(url).subscribe({
      next: () => {
        if (reload) {
          // Option 1: reload the whole collection
          this.fetchItems(clusterIdx);
        } else {
          // Option 2: update state locally
          this.state.update((state) => {
            const { itemsMap } = state;
            const existing = (itemsMap.get(clusterIdx) as T[]) ?? [];
            const updated = existing.filter((x: any) => this.getItemKey(x) !== itemId);

            itemsMap.set(clusterIdx, updated);
            return {
              ...state,
              itemsMap,
              notice: successNotice,
              loading: false,
            };
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.setPageState({
          error: err.message,
          loading: false,
        });
      },
    });
  }

  protected deleteMany(clusterIdx: number, itemIds: ItemIdPK[], reload = false): void {
    const requests = itemIds.map((id) =>
      this.http.delete<void>(this.resourceItemUrl(clusterIdx, id))
    );

    const notice = `${itemIds.length} items deleted successfully`;

    forkJoin(requests).subscribe({
      next: () => {
        if (reload) {
          this.fetchItems(clusterIdx);
          this.state.update((state) => {
            return { ...state, notice, loading: false };
          });
        } else {
          this.state.update((state) => {
            const { itemsMap } = state;
            const existing = (itemsMap.get(clusterIdx) as T[]) ?? [];
            const updated = existing.filter((x) => !itemIds.includes(this.getItemKey(x)));
            itemsMap.set(clusterIdx, updated);
            return {
              ...state,
              itemsMap,
              notice,
              loading: false,
            };
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.setPageState({ error: err.message });
      },
    });
  }
}
