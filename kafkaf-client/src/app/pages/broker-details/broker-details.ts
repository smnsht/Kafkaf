import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';

type BrokerTabs = 'BrokerLogDirectories' | 'BrokerConfigs' | 'BrokerMetrics';

@Component({
  selector: 'app-broker-details',
  imports: [RouterLink, StatsCard, RouterOutlet],
  templateUrl: './broker-details.html',
  styleUrl: './broker-details.scss',
})
export class BrokerDetails implements OnInit {
  public cardItems: StatsCardItem[] = [];
  public cluster = '';
  public broker = '';
  public currentTab?: BrokerTabs;

  constructor(route: ActivatedRoute) {
    ((paramMap) => {
      this.cluster = paramMap.get('cluster') ?? '';
      this.broker = paramMap.get('broker') ?? '';
    })(route.snapshot.paramMap);
  }

  ngOnInit(): void {
    this.cardItems = [
      { label: 'Segment Size', value: '3.97 KB' },
      { label: 'Segment Count', value: 19 },
      { label: 'Port', value: 9094 },
      { label: 'Host', value: 'localhost' },
    ];
  }

  onBrokerActivate(componentRef: any) {
    let timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as BrokerTabs;
      clearTimeout(timeoutID);
    }, 100);
  }
}
