import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { TopicSettingRow, TopicsListViewModel } from '../response.models';
import { BaseStore } from './base-store';

@Injectable({
  providedIn: 'root',
})
export class TopicsStore extends BaseStore<TopicsListViewModel> {
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

  loadTopics(): boolean {
    return this.loadCollection();
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

  createTopic(topicCreateRequest: any): Observable<void> {
    this.setPageState({
      loading: true,
      notice: undefined,
      error: undefined,
    });


    const clusterIdx = this.clusterIdx();
    const url = this.resourceUrl(clusterIdx);

    return this.http.post<void>(url, topicCreateRequest ).pipe(
      tap({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          console.error(err)
        }
      })
    );
  }

  deleteTopics(topicNames: string[]): Observable<void[]> {
    return this.removeItems(topicNames, true);
  }

  purgeMessages(topicNames: string[]): Observable<void[]> {
    const paths = topicNames.map((topic) => `${topic}/messages`);
    return this.removeItems(paths, false);
  }
}
