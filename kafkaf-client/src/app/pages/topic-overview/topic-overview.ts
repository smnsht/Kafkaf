import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { KafkafTable } from '../../directives/kafkaf-table';
import { TopicDetailsStore } from '../../services/topic-details-store';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';

@Component({
  selector: 'app-topic-overview',
  imports: [StatsCard, KafkafTable, PageWrapper],
  templateUrl: './topic-overview.html',
  // styleUrl: './topic-overview.scss'
})
export class TopicOverview implements OnInit {
  cardItems = signal<StatsCardItem[]>([]);
  partitions = computed(() => this.store.topicDetails()?.partitions);

  constructor(readonly store: TopicDetailsStore) {
    effect(() => {
      const topicDetails = this.store.topicDetails();

      if (topicDetails) {
        const cardItems: StatsCardItem[] = [
          { label: 'Partitions', value: topicDetails.partitionCount },
          { label: 'Replication Factor', value: topicDetails.replicationFactor },
          { label: 'URP', value: topicDetails.underReplicatedPartitions },
          { label: 'In Sync Replicas', value: topicDetails.inSyncReplicas },
          { label: 'Type', value: 'TODO' },
          { label: 'Segment Size', value: 'TODO' },
          { label: 'Segment Count', value: 'TODO' },
          { label: 'Clean Up Policy', value: 'TODO' },
          { label: 'Message Count', value: 'TODO'},
        ];

        this.cardItems.set(cardItems)
      }
    });
  }

  ngOnInit(): void {
    // this.cardItems = [
    //   { label: 'Partitions', value: 2 },
    //   { label: 'Replication Factor', value: 1 },
    //   { label: 'URP', value: 0 },
    //   { label: 'In Sync Replicas', value: '2 of 2' },
    //   { label: 'Type', value: '???' },
    //   { label: 'Segment Size', value: '198 Bytes' },
    //   { label: 'Segment Count', value: 1 },
    //   { label: 'Clean Up Policy', value: 'DELETE' },
    //   { label: 'Message Count', value: 2 },
    // ];
  }
}
