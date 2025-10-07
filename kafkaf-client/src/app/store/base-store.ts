import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, signal, WritableSignal } from '@angular/core';
import { forkJoin, Observable, tap } from 'rxjs';
import { BaseState, ItemIdPK, PageState } from './models';
import { LoggerService } from '../services/logger.service';

export abstract class BaseStore<T> {
  protected readonly http = inject(HttpClient);
  protected readonly logger = inject(LoggerService);
  protected readonly state: WritableSignal<BaseState<T>>;

  constructor(initialState?: Partial<BaseState<T>>) {
    this.state = signal<BaseState<T>>({
      items: new Array<T>(),
      clusterIdx: NaN,
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
  readonly items = computed(() => this.state().items);
  readonly clusterIdx = computed(() => this.state().clusterIdx);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly notice = computed(() => this.state().notice);

  readonly pageState = computed<PageState>(() => {
    const { loading, error, notice } = this.state();
    return { loading, error, notice };
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

  loadCollection(override = false): boolean {
    const clusterIdx = this.clusterIdx();

    if (clusterIdx <= 0) {
      return false;
    }

    if (this.items().length > 0 && !override) {
      return false;
    }

    this.state.update((state) => ({
      ...state,
      loading: true,
      error: undefined,
    }));

    this.fetchItems(clusterIdx);
    return true;
  }

  removeItem(itemId: ItemIdPK, reload = false, successNotice?: string): Observable<void> {
    this.setPageState({ loading: true });

    return this.deleteItem(this.clusterIdx(), itemId, reload, successNotice);
  }

  removeItems(ids: ItemIdPK[], reload = false): Observable<void[]> {
    this.setPageState({ loading: true });

    return this.deleteMany(this.clusterIdx(), ids, reload);
  }

  protected fetchItems(clusterIdx: number): void {
    const url = this.resourceUrl(clusterIdx);

    this.http.get<T[]>(url).subscribe({
      next: (items) => {
        this.logger.debug('[store fetchItems]: ', items);

        this.state.update((state) => {
          return {
            ...state,
            items,
            clusterIdx,
            loading: false,
          };
        });
      },
      error: (err: HttpErrorResponse) => {
        this.logger.error(err.message, err);

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
    successNotice: string = 'Item deleted successfully'
  ): Observable<void> {
    const url = this.resourceItemUrl(clusterIdx, itemId);

    return this.http.delete<void>(url).pipe(
      tap(() => {
        if (reload) {
          // Option 1: reload the whole collection
          this.logger.debug('[store deleteItem]: will reload collection');

          this.fetchItems(clusterIdx);
        } else {
          // Option 2: update state locally
          this.logger.debug('[store deleteItem]: will update state locally');

          this.state.update((state) => {
            const items = state.items.filter((x: any) => this.getItemKey(x) !== itemId);

            //itemsMap.set(clusterIdx, updated);
            return {
              ...state,
              items,
              notice: successNotice,
              loading: false,
            };
          });
        }
      })
    );
  }

  protected deleteMany(
    clusterIdx: number,
    itemIds: ItemIdPK[],
    reload = false
  ): Observable<void[]> {
    const requests = itemIds.map((id) =>
      this.http.delete<void>(this.resourceItemUrl(clusterIdx, id))
    );

    return forkJoin(requests).pipe(
      tap(() => {
        const notice = `${itemIds.length} items deleted successfully`;

        if (reload) {
          this.logger.debug('[store deleteMany]: will reload collection');

          this.fetchItems(clusterIdx);

          this.state.update((state) => {
            return { ...state, notice, loading: false };
          });
        } else {
          this.logger.debug('[store deleteMany]: will update state locally');

          this.state.update((state) => {
            const items = state.items.filter((x) => !itemIds.includes(this.getItemKey(x)));

            return {
              ...state,
              items,
              notice,
              loading: false,
            };
          });
        }
      })
    );
  }
}
