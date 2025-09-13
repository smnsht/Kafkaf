import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TopicTabOverview } from '../../components/topic-tab-overview/topic-tab-overview';

type TopicTabs =
  | 'TopicDetails'
  | 'TopicMessages'
  | 'TopicConsumers'
  | 'TopicSettings'
  | 'TopicStatistics';

@Component({
  selector: 'app-topic-overview',
  imports: [RouterLink, RouterOutlet, TopicTabOverview],
  templateUrl: './topic-details.html',
  // styleUrl: './topic-details.scss',
})
export class TopicDetails {
  public cluster = '';
  public topic = '';
  public currentTab: TopicTabs = 'TopicDetails';

  constructor(route: ActivatedRoute) {
    this.cluster = route.snapshot.paramMap.get('cluster') ?? '';
    this.topic = route.snapshot.paramMap.get('topic') ?? '';
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

  onTopicOverviewClick(): void {
    this.currentTab = 'TopicDetails';
  }
}
