import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { PageState } from '@app/store/base-store';
import { BrokerDetailsStore } from '@app/store/broker-details/broker-details.service';

type BrokerTabs = 'BrokerLogDirectories' | 'BrokerConfigs' | 'BrokerMetrics';

@Component({
  selector: 'app-broker-details',
  imports: [RouterLink, StatsCard, RouterOutlet, PageWrapper],
  templateUrl: './broker-details.html',
})
export class BrokerDetails implements OnInit {
  cardItems: StatsCardItem[] = [];
  cluster = Number.NaN;
  broker = Number.NaN;
  currentTab?: BrokerTabs;

  pageState: Signal<PageState>;

  constructor(route: ActivatedRoute, store: BrokerDetailsStore) {
    this.pageState = store.pageState;

    route.paramMap.subscribe((paramMap) => {
      this.cluster = Number.parseInt(paramMap.get('cluster')!);
      this.broker = Number.parseInt(paramMap.get('broker')!);

      store.loadConfigs({
        clusterIdx: this.cluster,
        brokerId: this.broker,
      });
    });
  }

  ngOnInit(): void {
    this.cardItems = [
      { label: 'Segment Size', value: 'TODO KB' },
      { label: 'Segment Count', value: 'TODO' },
      { label: 'Port', value: 'TODO' },
      { label: 'Host', value: 'TODO' },
    ];
  }

  onBrokerActivate(componentRef: any) {
    let timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as BrokerTabs;
      clearTimeout(timeoutID);
    }, 100);
  }
}
