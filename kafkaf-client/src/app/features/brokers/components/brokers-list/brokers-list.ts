import { Component, computed } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../shared/components/stats-card/stats-card';
import { ActivatedRoute, Router } from '@angular/router';
import { KafkafTable } from '../../directives/kafkaf-table';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { BrokersStore } from '../../shared/store/brokers-store';

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
  cardItems = computed(() => {
    const brokers = this.store.currentItems();
    const cardItems = [...defaultCardItems];

    if (brokers) {
      // Broker Count
      cardItems[0] = {
        ...cardItems[0],
        value: brokers.length,
        icon: brokers.length == 0 ? 'danger' : undefined,
      };

      // Active Controller
      cardItems[1] = {
        ...cardItems[1],
        value: brokers[0]?.controller,
        icon: undefined,
      };
    }
    return cardItems;
  });

  constructor(
    private readonly router: Router,
    readonly store: BrokersStore,
    route: ActivatedRoute
  ) {
    route.paramMap.subscribe((params) => {
      const cluster = parseInt(params.get('cluster')!);
      store.selectCluster(cluster);
      store.loadCollection();
    });
  }

  navigateToBrokerDetails(brokerId: number): void {
    this.router.navigate([this.router.url, brokerId]);
  }
}
