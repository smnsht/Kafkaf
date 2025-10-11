import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { finalize, Observable, tap } from 'rxjs';
import { TopicConfigRow, TopicSettingRow, TopicsListViewModel } from '../models/response.models';
import { BaseStore } from './base-store';
import { CreateTopicModel, RecreateTopicModel } from './request.models';
import { HttpErrorResponse } from '@angular/common/http';


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
      })
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
      })
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
      })
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
      tap((res) => {
        this.setNotice(
          'Successfully purged messages from ' +
            (res.length === 1 ? `${topicNames[0]} topic.` : `${res.length} topics.`)
        );
      })
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
          finalize(() => this.loadingConfigRows.set(false))
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
