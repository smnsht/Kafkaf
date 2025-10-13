import { Component, effect } from '@angular/core';
import { PartitionInfo } from '@app/features/consumers';
import { KafkafTableDirective, PageWrapper, StatsCard, StatsCardItem } from '@app/shared';
import { TopicDetailsStore } from '../../store/topic-detais/topic-details';

@Component({
  selector: 'app-topic-overview',
  imports: [StatsCard, KafkafTableDirective, PageWrapper],
  templateUrl: './topic-overview.html',
})
export class TopicOverview {
  cardItems: StatsCardItem[] = [];
  partitions: PartitionInfo[] = [];

  constructor(readonly store: TopicDetailsStore) {
    effect(() => {
      const topicDetails = this.store.details();

      if (topicDetails) {
        this.cardItems = [
          { label: 'Partitions', value: topicDetails.partitionCount },
          { label: 'Replication Factor', value: topicDetails.replicationFactor },
          { label: 'URP', value: topicDetails.underReplicatedPartitions },
          { label: 'In Sync Replicas', value: topicDetails.inSyncReplicas },
          { label: 'Type', value: 'TODO' },
          { label: 'Segment Size', value: 'TODO' },
          { label: 'Segment Count', value: 'TODO' },
          { label: 'Clean Up Policy', value: 'TODO' },
          { label: 'Message Count', value: 'TODO' },
        ];

        this.partitions = topicDetails.partitions;
      } else {
        this.store.loadTopicDetails();
      }
    });
  }
}
