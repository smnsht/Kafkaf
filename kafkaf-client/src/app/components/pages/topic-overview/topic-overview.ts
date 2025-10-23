import { Component, effect } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { PartitionInfo } from '@app/models/partition-info';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';

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
