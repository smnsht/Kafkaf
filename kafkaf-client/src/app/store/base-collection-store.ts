import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, signal, WritableSignal } from '@angular/core';
import { PageState } from '@app/models/page-state';
import { LoggerService } from '@app/services/logger/logger';
import { Observable, tap } from 'rxjs';
import { getErrorMessage2 } from './utils';

export interface BaseCollectionState<T> {
  collection?: T[];
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}

export abstract class BaseCollectionStore<T> {
  protected readonly http = inject(HttpClient);
  protected readonly logger = inject(LoggerService);

  protected readonly state: WritableSignal<BaseCollectionState<T>>;
  protected readonly clusterIdx: WritableSignal<number>;

  constructor(initialState: BaseCollectionState<T>) {
    this.state = signal(initialState);
    this.clusterIdx = signal(Number.NaN);
  }

  // Abstract
  protected abstract fetchCollection(): Observable<T[]>;

  // Common getters
  readonly clusterIndex = computed(() => this.clusterIdx());
  readonly collection = computed(() => this.state().collection);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly notice = computed(() => this.state().notice);
  readonly pageState = computed<PageState>(() => {
    const { loading, error, notice } = this.state();
    return { loading, error, notice };
  });
  readonly hasRecords = computed(() => {
    const data = this.collection();
    return Array.isArray(data) && data.length > 0;
  });

  // Common setters
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

  // Side-effects
  loadCollection(): void {
    this.setLoading(true);
    this.fetchCollection()
      .pipe(
        tap({
          next: (collection) => {
            this.state.update((state) => ({
              ...state,
              loading: false,
              collection,
            }));
          },
          error: (err: HttpErrorResponse) => {
            this.logger.errorResponse(err);

            this.setPageState({
              loading: false,
              error: getErrorMessage2(err),
            });
          },
        }),
      )
      .subscribe();
  }

  // Utils
  withNoticeHandling(noticeFn: (response: unknown) => string, timeout = 5000) {
    return tap({
      next: (response: unknown) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          notice: noticeFn(response),
        }));

        const handle = setTimeout(() => {
          this.setNotice(undefined);
          clearTimeout(handle);
        }, timeout);
      },
      error: (err: HttpErrorResponse) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: getErrorMessage2(err),
        }));

        const handle = setTimeout(() => {
          this.setError(undefined);
          clearTimeout(handle);
        }, timeout);
      },
    });
  }
}
