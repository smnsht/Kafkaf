import { computed, Injectable } from '@angular/core';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';
import { map, Observable, tap } from 'rxjs';
import { PartitionInfo } from '@app/models/partition-info';
import { TopicDetailsViewModel } from '@app/models/topic.models';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TopicOverviewStore extends SectionedDataCollectionStore<PartitionInfo> {
  readonly partitions = computed(() => this.collection());
  readonly topicDetails = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = this.state() as any;
    return state.topicDetails as TopicDetailsViewModel;
  });

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<PartitionInfo[]> {
    return this.http.get<TopicDetailsViewModel>(this.getResourceUrl()).pipe(
      tap((res) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = this.state() as any;
        state.topicDetails = { ...res, partitions: [] };
      }),
      map((res) => res.partitions),
    );
  }

  loadTopicDetails(): void {
    if (!this.hasRecords() && !this.loading()) {
      this.loadCollection();
    }
  }

  reloadTopicDetails(): void {
    this.loadCollection();
  }

  purgeMessagesFromPartition(partition: number): Observable<unknown> {
    const url = `${this.getResourceUrl()}/messages`;
    const queryParams = new HttpParams({ fromObject: { partition } });
    const noticeHandler = this.withNoticeHandling((_) => {
      return `Successfully purged messages from partition ${partition}. Please wait a while.`;
    });

    this.setLoading(true);

    return this.http.delete<number>(url, { params: queryParams }).pipe(noticeHandler);
  }
}
