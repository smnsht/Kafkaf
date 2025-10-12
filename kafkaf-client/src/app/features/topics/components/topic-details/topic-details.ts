import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import { TopicsDropdownMenu } from '../../components/topics-dropdown-menu/topics-dropdown-menu';
import { concatMap, timer } from 'rxjs';
import { PageWrapper, DropdownMenuEvent } from '@app/shared';
import { TopicDetailsStore } from '../../store/topic-detais/topic-details';
import { TopicsStore } from '../../store/topics/topics';
import { MessageForm } from '../message-form/message-form';

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
  currentTab: TopicTabs = 'TopicOverview';
  isEditSettings = false;

  constructor(
    public readonly topicsStore: TopicsStore,
    private readonly router: Router,
    readonly store: TopicDetailsStore,
    readonly route: ActivatedRoute,
  ) {
    store.loadTopicDetails();

    const { cluster } = getRequiredParams(route);

    topicsStore.selectCluster(cluster);
  }

  onTopicActivate(componentRef: any) {
    let timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as TopicTabs;

      this.isEditSettings = this.currentTab == 'TopicEdit';

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
          this.router.navigate([
            'clusters',
            this.store.clusterIdx(),
            'topics',
            this.store.topic(),
            { outlets: { topic: ['edit'] } },
          ]);

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
