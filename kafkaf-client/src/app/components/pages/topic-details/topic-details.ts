import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MessageForm } from '@app/components/features/message-form/message-form';
import { TopicsDropdownMenu } from '@app/components/features/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '@app/components/shared/dropdown-menu/dropdown-menu';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';
import { TopicsStore } from '@app/store/topics/topics.service';
import { delay, concatMap, timer } from 'rxjs';

type TopicTabs =
  | 'TopicOverview'
  | 'TopicMessages'
  | 'TopicConsumers'
  | 'TopicSettings'
  | 'TopicStatistics'
  | 'TopicEdit';

function getRequiredParams(route: ActivatedRoute) {
  const { paramMap } = route.snapshot;
  const cluster = Number.parseInt(paramMap.get('cluster')!);
  const topic = paramMap.get('topic')!;

  return { cluster, topic };
}

@Component({
  selector: 'app-topic-overview',
  imports: [RouterLink, RouterOutlet, MessageForm, TopicsDropdownMenu, PageWrapper],
  templateUrl: './topic-details.html',
  providers: [
    {
      provide: TopicDetailsStore,
      deps: [ActivatedRoute],
      useFactory: (route: ActivatedRoute) => {
        const { cluster, topic } = getRequiredParams(route);

        return new TopicDetailsStore(cluster, topic);
      },
    },
  ],
})
export class TopicDetails {
  public readonly topicsStore = inject(TopicsStore);
  private readonly router = inject(Router);
  readonly store = inject(TopicDetailsStore);
  readonly route = inject(ActivatedRoute);

  currentTab: TopicTabs = 'TopicOverview';
  isEditSettings = false;

  constructor() {
    this.store.loadTopicDetails();

    const { cluster } = getRequiredParams(this.route);

    this.topicsStore.selectCluster(cluster);
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
    const topic = this.store.details();

    if (event.confirmed && topic) {
      switch (event.command) {
        case 'EditSettings':
          this.router.navigate([
            'clusters',
            this.store.clusterIdx(),
            'topics',
            this.store.topic(),
            { outlets: { topic: ['edit'] } },
          ]);

          break;

        case 'ClearMessages':
          //
          this.topicsStore
            .purgeMessages([topic.name])
            .pipe(delay(2000))
            .subscribe(() => {
              this.topicsStore.setNotice(undefined);
              this.store.clearMessages();
              this.store.loadTopicDetails(true);
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
