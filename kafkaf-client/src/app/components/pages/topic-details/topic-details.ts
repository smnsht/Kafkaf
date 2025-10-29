import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MessageForm } from '@app/components/features/message-form/message-form';
import { TopicsDropdownMenu } from '@app/components/features/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '@app/components/shared/dropdown-menu/dropdown-menu';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { TopicMessagesStore } from '@app/store/topic-messages/topic-messages-store';
import { TopicOverviewStore } from '@app/store/topic-overview/topic-overview-store';
import { TopicSettingsStore } from '@app/store/topic-settings/topic-settings-store';
import { TopicsStore } from '@app/store/topics/topics-store';
import { delay, concatMap, timer } from 'rxjs';

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

  readonly topicsStore = inject(TopicsStore);
  readonly topicOverviewStore = inject(TopicOverviewStore);
  readonly topicSettingsStore = inject(TopicSettingsStore);
  readonly topicMessagesStore = inject(TopicMessagesStore);
  readonly route = inject(ActivatedRoute);

  currentTab: TopicTabs = 'TopicOverview';
  isEditSettings = false;

  ngOnInit(): void {
    this.topicOverviewStore.loadTopicDetails();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTopicActivate(componentRef: any) {
    const timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as TopicTabs;

      this.isEditSettings = this.currentTab == 'TopicEdit';

      clearTimeout(timeoutID);
    }, 100);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTopicDeactivate(componentRef: any) {
    console.log('Messages outlet deactivated:', componentRef);
  }

  onCommandSelected(event: DropdownMenuEvent): void {
    const topic = this.topicOverviewStore.topicDetails();

    if (event.confirmed && topic) {
      switch (event.command) {
        case 'EditSettings':
          this.router.navigate([
            'clusters',
            this.topicOverviewStore.clusterIndex(),
            'topics',
            topic.name,
            { outlets: { topic: ['edit'] } },
          ]);

          break;

        case 'ClearMessages':
          //
          this.topicsStore
            .purgeMessages([topic.name])
            .pipe(delay(2000))
            .subscribe(() => {
              this.topicMessagesStore.clearAll();
              this.topicOverviewStore.reloadTopicDetails();
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
