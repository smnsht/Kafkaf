import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, signal, WritableSignal } from '@angular/core';
import { ProblemDetails } from '@app/models/problem-details';
import { LoggerService } from '@app/services/logger/logger';
import { forkJoin, Observable, tap } from 'rxjs';

export type ItemIdPK = string | number;

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

export abstract class BaseStore<T> {
  protected readonly http = inject(HttpClient);
  protected readonly logger = inject(LoggerService);

  protected readonly state: WritableSignal<BaseState<T>>;

  constructor(initialState?: Partial<BaseState<T>>) {
    this.state = signal<BaseState<T>>({
      itemsMap: new Map<number, T[]>(),
      clusterIdx: Number.NaN,
      loading: false,
      error: undefined,
      notice: undefined,
      ...initialState,
    });
  }

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

  clearCurrentCluster(): void {
    const clusterIdx = this.clusterIdx();

    if (clusterIdx >= 0) {
      this.state.update((state) => {
        const { itemsMap } = state;
        itemsMap.delete(clusterIdx);

        return { ...state, itemsMap };
      });
    }
  }

  loadCollection(forceReload = false): boolean {
    const keys = this.keys();
    const clusterIdx = this.clusterIdx();

    if (clusterIdx >= 0 && (!keys.includes(clusterIdx) || forceReload)) {
      this.state.update((state) => ({
        ...state,
        loading: true,
        error: undefined,
      }));

      this.fetchCollection(clusterIdx);
      return true;
    }

    return false;
  }

  removeItem(itemId: ItemIdPK, reload = false, successNotice?: string): Observable<void> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    return this.deleteItem(this.clusterIdx(), itemId, reload, successNotice);
  }

  removeItems(ids: ItemIdPK[], reload = false): Observable<void[]> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    return this.deleteMany(this.clusterIdx(), ids, reload);
  }

  protected fetchCollection(clusterIdx: number): void {
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
        this.logger.error(`[fetchCollection] ${url}:`, err);

        this.setPageState({
          loading: false,
          error: err.message,
        });
      },
    });
  }

  protected deleteItem(
    clusterIdx: number,
    itemId: string | number,
    reload = false,
    successNotice = 'Item deleted successfully',
  ): Observable<void> {
    const url = this.resourceItemUrl(clusterIdx, itemId);

    return this.http.delete<void>(url).pipe(
      tap({
        next: () => {
          if (reload) {
            this.setNotice(successNotice);

            // Option 1: reload the whole collection
            this.fetchCollection(clusterIdx);
          } else {
            // Option 2: update state locally
            this.state.update((state) => {
              const { itemsMap } = state;
              const existing = (itemsMap.get(clusterIdx) as T[]) ?? [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          this.logger.error(`[deleteItem] ${url}:`, err);

          this.setPageState({
            loading: false,
            error: err.message,
          });
        },
      }),
    );
  }

  protected deleteMany(
    clusterIdx: number,
    itemIds: ItemIdPK[],
    reload = false,
    successNotice = 'Items deleted successfully.',
  ): Observable<void[]> {
    const requests = itemIds.map((id) =>
      this.http.delete<void>(this.resourceItemUrl(clusterIdx, id)),
    );

    return forkJoin(requests).pipe(
      tap({
        next: () => {
          if (reload) {
            this.fetchCollection(clusterIdx);
          } else {
            this.state.update((state) => {
              const { itemsMap } = state;
              const existing = (itemsMap.get(clusterIdx) as T[]) ?? [];
              const updated = existing.filter((x) => !itemIds.includes(this.getItemKey(x)));
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
        error: this.handleError.bind(this),
      }),
    );
  }

  protected handleError(err: HttpErrorResponse): void {
    const errorMessage = getErrorMessage(err);

    this.logger.error(errorMessage, err);

    this.setPageState({
      loading: false,
      error: errorMessage,
    });
  }
}

export function getErrorMessage(err: HttpErrorResponse): string {
  let errorMessage = 'An unexpected error occurred';

  // Check if the response body looks like ProblemDetails
  const problem = err.error as ProblemDetails;
  if (problem && (problem.title || problem.detail)) {
    errorMessage = problem.detail || problem.title!;
  } else if (err.message) {
    errorMessage = err.message;
  }

  return errorMessage;
}
