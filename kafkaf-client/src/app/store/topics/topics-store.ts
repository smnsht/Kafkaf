import { inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';
import { HttpTopicsService } from '@app/services/http-topics/http-topics';
import {
  CreateTopicModel,
  RecreateTopicModel,
  TopicsListViewModel,
  UpdateTopicModel,
} from '../../models/topic.models';

@Injectable({
  providedIn: 'root',
})
export class TopicsStore
  extends ClusteredDataCollectionStore<TopicsListViewModel>
  implements OnDestroy
{
  private topicsService = inject(HttpTopicsService);

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<TopicsListViewModel[]> {
    const clusterIdx = this.clusterIndex();

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

  createTopic(req: CreateTopicModel): Observable<unknown> {
    this.setLoading(true);

    return this.http
      .post<void>(`${this.getBaseResourceUrl()}/topics`, req)
      .pipe(this.withNoticeHandling(() => 'New Topic Created.'));
  }

  updateTopic(topicName: string, req: UpdateTopicModel): Observable<unknown> {
    this.setLoading(true);

    const url = `${this.getBaseResourceUrl()}/topics/${topicName}`;

    return this.http
      .put<void>(url, req)
      .pipe(this.withNoticeHandling(() => `Topic ${topicName} Updated.`));
  }

  deleteTopics(topicNames: string[]): Observable<unknown> {
    this.setLoading(true);

    const clusterIdx = this.clusterIndex();
    const noticeHandler = this.withNoticeHandling((res) => {
      const arr = res as void[];
      const notice =
        arr.length == 1
          ? `Topic ${topicNames[0]} deleted successfully.`
          : `${arr.length} topics deleted successfully.`;

      return notice;
    });

    // prettier-ignore
    return this.topicsService
      .deleteTopics(clusterIdx, topicNames)
      .pipe(noticeHandler);
  }

  deleteTopic(topicName: string): Observable<unknown> {
    return this.deleteTopics([topicName]);
  }

  recreateTopic(topicName: string, req: RecreateTopicModel): Observable<unknown> {
    this.setLoading(true);

    const noticeHandler = this.withNoticeHandling(() => `Topic ${topicName} recreated.`);

    return this.topicsService
      .recreateTopic(this.clusterIndex(), topicName, req)
      .pipe(noticeHandler);
  }

  // Messages handling
  purgeMessages(topicNames: string[]): Observable<unknown> {
    this.setLoading(true);

    const noticeHandler = this.withNoticeHandling((res) => {
      const arr = res as void[];
      return (
        'Successfully purged messages from ' +
        (arr.length === 1 ? `${topicNames[0]} topic.` : `${arr.length} topics.`)
      );
    });

    // prettier-ignore
    return this.topicsService
      .purgeMessages(this.clusterIndex(), topicNames)
      .pipe(noticeHandler);
  }
}
