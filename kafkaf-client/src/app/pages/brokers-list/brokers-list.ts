import { Component, computed, signal, Signal } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { ActivatedRoute, Router } from '@angular/router';
import { KafkafTable } from '../../directives/kafkaf-table';
import { PageState, PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { BrokersInfoView, BrokersStore } from '../../services/brokers-store';

const defaultCardItems: ReadonlyArray<StatsCardItem> = [
  { label: 'Broker Count', value: 0, icon: 'danger' },
  { label: 'Active Controller', value: 0, icon: 'info' },
  { label: 'Version', value: 'TODO' },
  { label: 'Online', value: 'TODO' },
  { label: 'URP', value: 'TODO' },
  { label: 'In Sync Replicas', value: 'TODO' },
  { label: 'Out Of Sync Replicas', value: 'TODO' },
];

@Component({
  selector: 'app-brokers-list',
  standalone: true,
  imports: [StatsCard, KafkafTable, PageWrapper],
  templateUrl: './brokers-list.html',
  styleUrl: './brokers-list.scss',
})
export class BrokersList {
  pageState: Signal<PageState>;
  brokersInfo: Signal<BrokersInfoView | undefined>;

  brokers = computed(() => {
    const info = this.brokersInfo();
    return info?.brokers ?? [];
  });

  cardItems = computed(() => {
    const info = this.brokersInfo();
    const cardItems = [...defaultCardItems];

    if (info != null) {
      // Broker Count
      cardItems[0] = {
        ...cardItems[0],
        value: info.brokers.length,
        icon: info.brokers.length == 0 ? 'danger' : undefined,
      };

      // Active Controller
      cardItems[1] = {
        ...cardItems[1],
        value: info.controller,
        icon: undefined,
      };
    }
    return cardItems;
  });

  constructor(private router: Router, store: BrokersStore, route: ActivatedRoute) {
    const clusterIdxSignal = signal(NaN);

    this.pageState = store.pageState;
    this.brokersInfo = store.brokersInfoFor(clusterIdxSignal);

    route.paramMap.subscribe((params) => {
      const cluster = params.get('cluster') ?? '';
      const clusterIdx = parseInt(cluster);

      clusterIdxSignal.set(clusterIdx);
      store.loadBrokers(clusterIdx);
    });
  }

  navigateToBrokerDetails(brokerId: number): void {
    this.router.navigate([this.router.url, brokerId]);
  }
}
