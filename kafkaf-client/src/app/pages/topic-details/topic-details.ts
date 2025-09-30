import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TopicDetailsStore } from '../../services/topic-details-store';

type TopicTabs =
  | 'TopicOverview'
  | 'TopicMessages'
  | 'TopicConsumers'
  | 'TopicSettings'
  | 'TopicStatistics';

@Component({
  selector: 'app-topic-overview',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './topic-details.html',
  providers: [{
    provide: TopicDetailsStore,
    deps:[ActivatedRoute],
    useFactory: (route: ActivatedRoute) => {
      const { paramMap } = route.snapshot;
      const cluster = parseInt(paramMap.get('cluster')!);
      const topic = paramMap.get('topic')!;

      return new TopicDetailsStore(cluster, topic)
    }
  }]
  // styleUrl: './topic-details.scss',
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
}
