import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { BrokerDetailsStore } from '@app/store/broker-details/broker-details.service';

type BrokerTabs = 'BrokerLogDirectories' | 'BrokerConfigs' | 'BrokerMetrics';

@Component({
  selector: 'app-broker-details',
  imports: [RouterLink, StatsCard, RouterOutlet, PageWrapper],
  templateUrl: './broker-details.html',
})
export class BrokerDetails implements OnInit {
  readonly store = inject(BrokerDetailsStore);

  cardItems: StatsCardItem[] = [];
  cluster = Number.NaN;
  broker = Number.NaN;
  currentTab?: BrokerTabs;

  constructor() {
    effect(() => {
      const clusterIndex = this.store.clusterIndex();
      const brokerId = this.store.brokerId();

      if (Number.isInteger(clusterIndex) && Number.isInteger(brokerId)) {
        console.log('asdfkasdfasd ');
        this.store.loadConfigs();
      }
    });
  }
  ngOnInit(): void {
    this.cluster = this.store.clusterIndex();
    this.broker = this.store.brokerId();
    this.cardItems = [
      { label: 'Segment Size', value: 'TODO KB' },
      { label: 'Segment Count', value: 'TODO' },
      { label: 'Port', value: 'TODO' },
      { label: 'Host', value: 'TODO' },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBrokerActivate(componentRef: any) {
    const timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as BrokerTabs;
      clearTimeout(timeoutID);
    }, 100);
  }
}
