import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TopicDetailsStore } from '../../services/topic-details-store';
import { MessageForm } from '../../components/message-form/message-form';
import { TopicsDropdownMenu } from '../../components/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '../../components/dropdown-menu/dropdown-menu';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { TopicsStore } from '../../store/topics-store';
import { concatMap, timer } from 'rxjs';

type TopicTabs =
  | 'TopicOverview'
  | 'TopicMessages'
  | 'TopicConsumers'
  | 'TopicSettings'
  | 'TopicStatistics';

function getRequiredParams(route: ActivatedRoute) {
  const { paramMap } = route.snapshot;
  const cluster = parseInt(paramMap.get('cluster')!);
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
  currentTab: TopicTabs = 'TopicOverview';

  constructor(
    public readonly topicsStore: TopicsStore,
    private readonly router: Router,
    readonly store: TopicDetailsStore,
    readonly route: ActivatedRoute
  ) {
    store.loadTopicDetails();

    const { cluster } = getRequiredParams(route);

    topicsStore.selectCluster(cluster);
  }

  onTopicActivate(componentRef: any) {
    let timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as TopicTabs;
      clearTimeout(timeoutID);
    }, 100);
  }

  onTopicDeactivate(componentRef: any) {
    console.log('Messages outlet deactivated:', componentRef);
  }

  onCommandSelected(event: DropdownMenuEvent): void {
    const topic = this.store.details();

    if (event.confirmed && topic) {
      switch (event.command) {
        case 'EditSettings':
          console.log('EditSettings', topic);
          break;

        case 'ClearMessages':
          this.topicsStore.purgeMessages([topic.name]).subscribe();
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
          this.topicsStore.deleteTopic(topic.name).pipe(
            concatMap(() => timer(2000))
          ).subscribe(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          });
          break;
      }
    }
  }
}
