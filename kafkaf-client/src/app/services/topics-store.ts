import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { forkJoin, map, switchMap } from 'rxjs';
import { BatchResult, TopicsListViewModel } from '../response.models';
import { BaseStore, ItemIdPK, PageState } from './base-store';

interface TopicsState {
  topicsMap: Map<number, TopicsListViewModel[]>;
  clusterIdx: number;
  loading?: boolean;
  error?: string;
  notice?: string;
}

const defaultState: TopicsState = {
  topicsMap: new Map<number, TopicsListViewModel[]>(),
  clusterIdx: NaN,
};

@Injectable({
  providedIn: 'root',
})
export class TopicsStore extends BaseStore<TopicsListViewModel> {
  protected override resourceUrl(clusterIdx: number): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/topics`;
  }

  protected override resourceItemUrl(clusterIdx: number, topicName: string): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}`;
  }

  protected override getItemKey(item: TopicsListViewModel): string | number {
    return item.topicName;
  }

  loadTopics(): boolean {
    return this.loadCollection();
  }

  removeTopic(topicName: string, reload = false): void {
    this.removeItem(topicName, reload, `Topic "${topicName}" deleted`);
  }

  deleteTopics(topicName: string[]): void {
    this.removeItems(topicName, true)
  }
}













class TopicsStore_old {
  private readonly http = inject(HttpClient);
  private readonly state = signal<TopicsState>({ ...defaultState });

  // getters

  readonly topicsMap = computed(() => this.state().topicsMap);
  readonly clusterIdx = computed(() => this.state().clusterIdx);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly notice = computed(() => this.state().notice);

  readonly topicsKeys = computed(() => {
    const keys = this.state().topicsMap.keys();
    return Array.from(keys);
  });

  readonly pageState = computed<PageState>(() => {
    const { loading, error, notice } = this.state();
    return { loading, error, notice };
  });

  readonly topics = computed(() => {
    const { topicsMap, clusterIdx } = this.state();
    return topicsMap.get(clusterIdx);
  });

  //////////////////////////////////////////////////////////////////////////
  deleteTopics(topicNames: string[]): void {
    const clusterIdx = this.clusterIdx();

    if (clusterIdx >= 0) {
      this.state.update((state) => {
        return {
          ...state,
          loading: true,
          error: undefined,
          notice: undefined,
        };
      });

      this._deleteTopics(clusterIdx, topicNames);
    }
  }

  purgeMessages(topicNames: string[]): void {
    const clusterIdx = this.clusterIdx();

    if (clusterIdx >= 0) {
      this.state.update((state) => {
        return {
          ...state,
          loading: true,
          error: undefined,
          notice: undefined,
        };
      });

      this._purgeMessages(clusterIdx, topicNames);
    }
  }
  //////////////////////////////////////////////////////////////////////////

  loadTopis(clusterIdx: number): boolean {
    const keys = this.topicsKeys();

    if (clusterIdx >= 0 && !keys.includes(clusterIdx)) {
      this.state.update((state) => {
        return {
          ...state,
          loading: true,
          error: undefined,
          clusterIdx: clusterIdx,
        };
      });

      this.fetchTopics(clusterIdx);

      return true;
    }

    return false;
  }

  private fetchTopics(clusterIdx: number): void {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics`;

    this.http.get<TopicsListViewModel[]>(url).subscribe({
      next: (data) => {
        this.state.update((state) => {
          const { topicsMap } = state;
          topicsMap.set(clusterIdx, data);
          return { topicsMap, clusterIdx };
        });
      },
      error: (err: HttpErrorResponse) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: err.message,
        }));
      },
    });
  }

  private _deleteTopics(clusterIdx: number, topicNames: string[]): void {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics`;

    let params = new HttpParams();
    topicNames.forEach((name) => {
      params = params.append('names', name);
    });

    this.http
      .delete<BatchResult>(url, { params })
      .pipe(
        switchMap((deleteResult) =>
          this.http
            .get<TopicsListViewModel[]>(url)
            .pipe(map((topics) => ({ deleteResult, topics })))
        )
      )
      .subscribe({
        next: ({ deleteResult, topics }) => {
          this.state.update((state) => {
            const { topicsMap } = state;
            topicsMap.set(clusterIdx, topics);

            let notice = deleteResult.message;

            if (!notice) {
              const successfulDeletions = deleteResult.results.filter(
                (item) => item.success
              ).length;
              const failedDeletions = deleteResult.results.length - successfulDeletions;

              notice = [
                successfulDeletions > 0
                  ? `${successfulDeletions} topic${
                      successfulDeletions > 1 ? 's' : ''
                    } deleted successfully.`
                  : '',
                failedDeletions > 0
                  ? `${failedDeletions} deletion${failedDeletions > 1 ? 's' : ''} failed.`
                  : '',
              ]
                .filter(Boolean)
                .join(' ');
            }

            return { ...state, topicsMap, notice, loading: false };
          });
        },
        error: (err: HttpErrorResponse) => {
          this.state.update((state) => ({
            ...state,
            loading: false,
            error: `Failed to delete topics: ${err.message}`,
          }));
        },
      });
  }

  private _purgeMessages(clusterIdx: number, topicNames: string[]): void {
    const requests = topicNames.map((topic) => {
      const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topic}/messages`;
      return this.http.delete<number>(url);
    });

    forkJoin(requests).subscribe({
      next: (data) => {
        console.log(data);
        this.state.update((state) => {
          return {
            ...state,
            loading: false,
            notice: 'Messages purged',
          };
        });
      },
      error: (err: HttpErrorResponse) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: `Failed to delete messages: ${err.message}`,
        }));
      },
    });
  }
}
