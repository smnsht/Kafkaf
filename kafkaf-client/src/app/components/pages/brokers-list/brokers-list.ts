import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { BrokerInfoRow } from '@app/store/brokers/broker-info-row.model';
import { BrokersStore } from '@app/store/brokers/brokers.service';
import { filter } from 'rxjs';

const defaultCardItems: readonly StatsCardItem[] = [
  { label: 'Broker Count', value: 0, icon: 'danger' },
  { label: 'Active Controller', value: 0, icon: 'info' },
  { label: 'Version', value: 'TODO' },
  { label: 'Online', value: 'TODO' },
  { label: 'URP', value: 'TODO' },
  { label: 'In Sync Replicas', value: 'TODO' },
  { label: 'Out Of Sync Replicas', value: 'TODO' },
];

@Component({
  selector: 'page-brokers-list',
  standalone: true,
  imports: [StatsCard, PageWrapper, KafkafTableDirective],
  templateUrl: './brokers-list.html',
})
export class BrokersList implements OnInit {
  private readonly router = inject(Router);

  readonly store = inject(BrokersStore);

  cardItems = computed(() => {
    const brokers = this.store.brokers();

    if (brokers) {
      return this.buildCarItems(brokers);
    }

    return [...defaultCardItems];
  });

  ngOnInit(): void {
    this.store.clusterIdx$.pipe(filter(Number.isInteger)).subscribe((_) => {
      this.store.loadBrokers();
    });
  }

  navigateToBrokerDetails(brokerId: number): void {
    this.router.navigate([this.router.url, brokerId]);
  }

  private buildCarItems(brokers: BrokerInfoRow[]): StatsCardItem[] {
    const cardItems = [...defaultCardItems];

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

    return cardItems;
  }
}
