import { Injectable, OnDestroy, signal } from '@angular/core';
import { finalize, forkJoin, Observable, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from 'environments/environment';
import { TopicConfigRow } from './topic-config-row.model';
import { TopicSettingRow } from '../topic-settings/topic-setting-row.model';
import { TopicsListViewModel } from './topics-list-view.model';
import { BaseStore } from '../base-store';
import { CreateTopicModel } from './create-topic.model';
import { RecreateTopicModel } from './recreate-topic.model';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';
import { getErrorMessage2 } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class TopicsStore extends BaseStore<TopicsListViewModel> {
  topicConfigRows = signal<TopicConfigRow[]>([]);
  loadingConfigRows = signal(false);

  constructor() {
    super({});
  }

  protected override resourceUrl(clusterIdx: number): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/topics`;
  }

  protected override resourceItemUrl(clusterIdx: number, topicName: string): string {
    return `${this.resourceUrl(clusterIdx)}/${topicName}`;
  }

  protected override getItemKey(item: TopicsListViewModel): string | number {
    return item.topicName;
  }

  loadTopics(forceReload = false): boolean {
    return this.loadCollection(forceReload);
  }

  loadTopicSettings(topicName: string): Observable<TopicSettingRow[]> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    const clusterIdx = this.clusterIdx();
    const url = this.resourceItemUrl(clusterIdx, `${topicName}/settings`);

    return this.http.get<TopicSettingRow[]>(url).pipe(
      tap({
        next: () => {
          this.setPageState({ loading: false });
        },
        error: (err) => {
          this.setError(err.message);
          this.setPageState({ error: err.message, loading: false });
        },
      }),
    );
  }

  createTopic(req: CreateTopicModel, notice = 'New Topic Created.'): Observable<void> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    const clusterIdx = this.clusterIdx();
    const url = this.resourceUrl(clusterIdx);

    return this.http.post<void>(url, req).pipe(
      tap({
        next: () => {
          this.setPageState({ loading: false });
          this.state.update((state) => ({
            ...state,
            notice,
            loading: false,
          }));
        },
        error: this.handleError.bind(this),
      }),
    );
  }

  recreateTopic(topicName: string, req: RecreateTopicModel): Observable<void> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    const clusterIdx = this.clusterIdx();
    const url = this.resourceItemUrl(clusterIdx, `${topicName}/recreate`);

    return this.http.post<void>(url, req).pipe(
      tap({
        next: () => {
          this.setPageState({ loading: false });
          this.state.update((state) => ({
            ...state,
            notice: `Topic ${topicName} recreated.`,
            loading: false,
          }));
        },
        error: this.handleError.bind(this),
      }),
    );
  }

  deleteTopic(topicName: string): Observable<void> {
    return this.removeItem(topicName, true, `Topic ${topicName} deleted successfully.`);
  }

  deleteTopics(topicNames: string[]): Observable<void[]> {
    return this.removeItems(topicNames, true);
  }

  purgeMessages(topicNames: string[]): Observable<void[]> {
    const paths = topicNames.map((topic) => `${topic}/messages`);

    return this.removeItems(paths).pipe(
      tap({
        next: (res) => {
          this.setNotice(
            'Successfully purged messages from ' +
              (res.length === 1 ? `${topicNames[0]} topic.` : `${res.length} topics.`),
          );
        },
        error: this.handleError.bind(this),
      }),
    );
  }

  loadTopicConfigRows() {
    if (this.topicConfigRows().length == 0) {
      const clusterIdx = this.clusterIdx();
      const url = this.resourceItemUrl(clusterIdx, 'configs');

      this.http
        .get<TopicConfigRow[]>(url)
        .pipe(
          tap(() => this.loadingConfigRows.set(true)),
          finalize(() => this.loadingConfigRows.set(false)),
        )
        .subscribe({
          next: (configs) => {
            this.topicConfigRows.set(configs);
          },
          error: (err: HttpErrorResponse) => {
            this.logger.error('[loadTopicConfigRows()]: ', err);
            this.setError('Error loading topic configs!');
          },
        });
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class TopicsStore2
  extends ClusteredDataCollectionStore<TopicsListViewModel>
  implements OnDestroy
{
  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<TopicsListViewModel[]> {
    const clusterIdx = this.clusterIdx();

    if (Number.isNaN(clusterIdx)) {
      return of([]);
    }

    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics`;
    return this.http.get<TopicsListViewModel[]>(url);
  }

  ngOnDestroy(): void {
    this.clusterIdx$.complete();
  }

  loadTopics(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }

  reloadTopics(): void {
    this.loadCollection();
  }

  deleteTopics(topicNames: string[]): Observable<void[]> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    const clusterIdx = this.clusterIdx();
    const requests = topicNames.map((topic) => {
      const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topic}`;
      return this.http.delete<void>(url);
    });

    return forkJoin(requests).pipe(
      tap({
        next: (arr) => {
          const notice =
            arr.length == 1
              ? `Topic ${topicNames[0]} deleted successfully.`
              : `${arr.length} topics deleted successfully.`;

          this.setPageState({
            loading: false,
            error: undefined,
            notice,
          });

          // clean up notice after 5 seconds
          const handle = setTimeout(() => {
            this.setNotice(undefined);
            clearTimeout(handle);
          }, 5000);
        },
        error: (err: HttpErrorResponse) => {
          this.logger.errorResponse(err);

          this.setPageState({
            loading: false,
            error: getErrorMessage2(err),
          });

          // clean up error after 5 seconds
          const handle = setTimeout(() => {
            this.setError(undefined);
            clearTimeout(handle);
          }, 5000);
        },
      }),
    );
  }

  deleteTopic(topicName: string): Observable<void[]> {
    const topicNames: string[] = [topicName];
    return this.deleteTopics(topicNames);
  }

  recreateTopic(topicName: string, req: RecreateTopicModel): Observable<void> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });

    const clusterIdx = this.clusterIdx();
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/recreate`;

    return this.http.post<void>(url, req).pipe(
      tap({
        next: () => {
          this.state.update((state) => ({
            ...state,
            notice: `Topic ${topicName} recreated.`,
            loading: false,
          }));

          // clean up notice after 5 seconds
          const handle = setTimeout(() => {
            this.setNotice(undefined);
            clearTimeout(handle);
          }, 5000);
        },
        error: (err: HttpErrorResponse) => {
          this.logger.errorResponse(err);

          this.setPageState({
            loading: false,
            error: getErrorMessage2(err),
          });

          // clean up error after 5 seconds
          const handle = setTimeout(() => {
            this.setError(undefined);
            clearTimeout(handle);
          }, 5000);
        }
      }),
    );
  }

}
