import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TopicDetailsStore } from '../../services/topic-details-store';
import { MessageForm } from '../../components/message-form/message-form';
import { TopicsDropdownMenu } from '../../components/topics-dropdown-menu/topics-dropdown-menu';
import { DropdownMenuEvent } from '../../components/dropdown-menu/dropdown-menu';

type TopicTabs =
  | 'TopicOverview'
  | 'TopicMessages'
  | 'TopicConsumers'
  | 'TopicSettings'
  | 'TopicStatistics';

@Component({
  selector: 'app-topic-overview',
  imports: [RouterLink, RouterOutlet, MessageForm, TopicsDropdownMenu],
  templateUrl: './topic-details.html',
  providers: [
    {
      provide: TopicDetailsStore,
      deps: [ActivatedRoute],
      useFactory: (route: ActivatedRoute) => {
        const { paramMap } = route.snapshot;
        const cluster = parseInt(paramMap.get('cluster')!);
        const topic = paramMap.get('topic')!;

        return new TopicDetailsStore(cluster, topic);
      },
    },
  ],
})
export class TopicDetails {
  currentTab: TopicTabs = 'TopicOverview';

  constructor(readonly store: TopicDetailsStore) {
    store.loadTopicDetails();
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
    // TODO
    console.log(event);
  }
}
