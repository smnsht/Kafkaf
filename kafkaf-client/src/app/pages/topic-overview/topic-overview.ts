import { Component, effect } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { KafkafTable } from '../../directives/kafkaf-table';
import { TopicDetailsStore } from '../../services/topic-details-store';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { PartitionInfo } from '../../response.models';

@Component({
  selector: 'app-topic-overview',
  imports: [StatsCard, KafkafTable, PageWrapper],
  templateUrl: './topic-overview.html',
  // styleUrl: './topic-overview.scss'
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
      }
    });
  }
}
