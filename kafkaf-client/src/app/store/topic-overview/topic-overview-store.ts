import { computed, Injectable } from '@angular/core';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';
import { map, Observable, tap } from 'rxjs';
import { TopicDetailsViewModel } from '../topic-detais/topic-details-view.model';
import { PartitionInfo } from '@app/models/partition-info';

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
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }

  reloadTopicDetails(): void {
    this.loadCollection();
  }
}
