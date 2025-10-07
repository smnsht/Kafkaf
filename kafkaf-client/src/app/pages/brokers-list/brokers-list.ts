import { Component, computed, effect, OnInit } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { Router } from '@angular/router';
import { KafkafTable } from '../../directives/kafkaf-table';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { BrokersStore, provideBrokersStore } from '../../store/brokers-store';

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
  providers: [provideBrokersStore()],
  templateUrl: './brokers-list.html',
  styleUrl: './brokers-list.scss',
})
export class BrokersList {
  brokers = computed(() => this.store.item()?.brokers ?? []);
  controller = computed(() => this.store.item()?.controller);

  cardItems = computed(() => {
    const brokersInfo = this.store.item();
    const cardItems = [...defaultCardItems];

    if (brokersInfo != null) {
      // Broker Count
      cardItems[0] = {
        ...cardItems[0],
        value: brokersInfo.brokers.length,
        icon: brokersInfo.brokers.length == 0 ? 'danger' : undefined,
      };

      // Active Controller
      cardItems[1] = {
        ...cardItems[1],
        value: brokersInfo.controller,
        icon: undefined,
      };
    }
    return cardItems;
  });

  constructor(private router: Router, readonly store: BrokersStore) {
    effect(() => {
      if (!isNaN(store.clusterIdx())) {
        store.loadBrokers();
      }
    });
  }

  navigateToBrokerDetails(brokerId: number): void {
    this.router.navigate([this.router.url, brokerId]);
  }
}
