import { Component, computed, inject, OnInit } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicDetailsViewModel } from '@app/models/topic.models';
import { TopicOverviewStore } from '@app/store/topic-overview/topic-overview-store';
import { TopicSettingsStore } from '@app/store/topic-settings/topic-settings-store';
import { TopicsDropdownMenu } from '@app/components/features/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '@app/components/shared/dropdown-menu/dropdown-menu';
import { PartitionInfo } from '@app/models/partition-info';
import { delay, tap } from 'rxjs';

@Component({
  selector: 'app-topic-overview',
  imports: [StatsCard, KafkafTableDirective, PageWrapper, TopicsDropdownMenu],
  templateUrl: './topic-overview.html',
})
export class TopicOverview implements OnInit {
  readonly topicOverviewStore = inject(TopicOverviewStore);
  private readonly topicSettingsStore = inject(TopicSettingsStore);

  private readonly cleanUpPolicy = computed(() => {
    const settings = this.topicSettingsStore.settings();
    const setting = settings?.find((s) => s.name == 'cleanup.policy');

    return setting ? setting.value.toUpperCase() : setting;
  });

  topicName = computed(() => {
    const topicDetails = this.topicOverviewStore.topicDetails();
    return topicDetails ? topicDetails.name : '';
  });

  cardItems = computed<StatsCardItem[]>(() => {
    const topicDetails = this.topicOverviewStore.topicDetails();
    const cleanUpPolicy = this.cleanUpPolicy();

    return this.buildStatsCardItems(topicDetails, cleanUpPolicy);
  });

  ngOnInit(): void {
    this.topicOverviewStore.loadTopicDetails();
    this.topicSettingsStore.loadSettings();
  }

  onCommandSelected(event: DropdownMenuEvent, info: PartitionInfo): void {
    if (event.confirmed) {
      this.topicOverviewStore
        .purgeMessagesFromPartition(info.partition)
        .pipe(
          delay(30000),
          tap(() => this.topicOverviewStore.reloadTopicDetails()),
        )
        .subscribe();
    }
  }

  private buildStatsCardItems(
    topicDetails: TopicDetailsViewModel | undefined,
    cleanUpPolicy: string | undefined,
  ): StatsCardItem[] {
    if (topicDetails) {
      return [
        { label: 'Partitions', value: topicDetails.partitionCount },
        { label: 'Replication Factor', value: topicDetails.replicationFactor },
        { label: 'URP', value: topicDetails.underReplicatedPartitions },
        { label: 'In Sync Replicas', value: topicDetails.inSyncReplicas },
        { label: 'Type', value: topicDetails.internal ? 'Internal' : 'External' },
        { label: 'Segment Size', value: 'TODO' },
        { label: 'Segment Count', value: 'TODO' },
        { label: 'Clean Up Policy', value: cleanUpPolicy ?? '' },
        { label: 'Message Count', value: topicDetails.messageCount ?? 0 },
      ];
    }

    return [];
  }
}
