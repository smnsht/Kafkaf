import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MessageForm } from '@app/components/features/message-form/message-form';
import { TopicsDropdownMenu } from '@app/components/features/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '@app/components/shared/dropdown-menu/dropdown-menu';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { TopicMessagesStore } from '@app/store/topic-messages/topic-messages-store';
import { TopicOverviewStore } from '@app/store/topic-overview/topic-overview-store';
import { TopicSettingsStore } from '@app/store/topic-settings/topic-settings-store';
import { TopicsStore } from '@app/store/topics/topics-store';
import { concatMap, timer } from 'rxjs';

type TopicTabs =
  | 'TopicOverview'
  | 'TopicMessages'
  | 'TopicConsumers'
  | 'TopicSettings'
  | 'TopicStatistics'
  | 'TopicEdit';

@Component({
  selector: 'app-topic-overview',
  imports: [RouterLink, RouterOutlet, MessageForm, TopicsDropdownMenu, PageWrapper],
  templateUrl: './topic-details.html',
})
export class TopicDetails implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly topicsStore = inject(TopicsStore);
  readonly overviewStore = inject(TopicOverviewStore);
  readonly settingsStore = inject(TopicSettingsStore);
  readonly messagesStore = inject(TopicMessagesStore);

  readonly topicName = computed(() => this.overviewStore.topicDetails()?.name);

  currentTab: TopicTabs = 'TopicOverview';
  isEditSettings = false;

  ngOnInit(): void {
    this.overviewStore.loadTopicDetails();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTopicActivate(componentRef: any) {
    const timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as TopicTabs;

      this.isEditSettings = this.currentTab == 'TopicEdit';

      clearTimeout(timeoutID);
    }, 100);
  }

  onCommandSelected(event: DropdownMenuEvent): void {
    const topic = this.overviewStore.topicDetails();

    if (event.confirmed && topic) {
      switch (event.command) {
        case 'EditSettings':
          this.router.navigate([
            'clusters',
            this.overviewStore.clusterIndex(),
            'topics',
            topic.name,
            { outlets: { topic: ['edit'] } },
          ]);

          break;

        case 'ClearMessages':
          this.topicsStore
            .purgeMessages([topic.name])
            .subscribe(() => {
              this.overviewStore.reloadTopicDetails();
            });
          break;

        case 'RecreateTopic':
          this.topicsStore
            .recreateTopic(topic.name, {
              numPartitions: topic.partitionCount,
              replicationFactor: topic.replicationFactor,
            })
            .subscribe();
          break;

        case 'RemoveTopic':
          this.topicsStore
            .deleteTopic(topic.name)
            .pipe(concatMap(() => timer(2000)))
            .subscribe(() => {
              this.router.navigate(['../'], { relativeTo: this.route });
            });
          break;
      }
    }
  }
}
