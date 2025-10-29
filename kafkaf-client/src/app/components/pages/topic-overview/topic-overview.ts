import { Component, computed, inject, OnInit } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicDetailsViewModel } from '@app/store/topic-detais/topic-details-view.model';
import { TopicOverviewStore } from '@app/store/topic-overview/topic-overview-store';

@Component({
  selector: 'app-topic-overview',
  imports: [StatsCard, KafkafTableDirective, PageWrapper],
  templateUrl: './topic-overview.html',
})
export class TopicOverview implements OnInit {
  readonly store = inject(TopicOverviewStore);

  cardItems = computed<StatsCardItem[]>(() => {
    const topicDetails = this.store.topicDetails();
    return this.buildStatsCardItems(topicDetails);
  });

  ngOnInit(): void {
    this.store.loadTopicDetails();
  }

  private buildStatsCardItems(topicDetails: TopicDetailsViewModel | undefined): StatsCardItem[] {
    if (topicDetails) {
      return [
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
    }

    return [];
  }
}
