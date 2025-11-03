import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { BrokerInfoRow, BrokerConfigRow } from '@app/models/broker.models';
import { BrokerDetailsStore } from '@app/store/broker-details/broker-details-store';
import { BrokersStore } from '@app/store/brokers/brokers-store';

type BrokerTabs = 'BrokerLogDirectories' | 'BrokerConfigs' | 'BrokerMetrics';

@Component({
  selector: 'app-broker-details',
  imports: [RouterLink, StatsCard, RouterOutlet, PageWrapper],
  templateUrl: './broker-details.html',
})
export class BrokerDetails implements OnInit {
  readonly detailsStore = inject(BrokerDetailsStore);
  readonly brokersStore = inject(BrokersStore);

  readonly cluster = computed(() => this.detailsStore.clusterIndex());
  readonly broker = computed(() => this.detailsStore.brokerId());

  readonly cardItems = computed(() => {
    const clusterIdx = this.detailsStore.clusterIndex();
    const infoRows = this.brokersStore.brokers();
    const configs = this.detailsStore.collection();
    const currentBroker = infoRows?.at(clusterIdx);

    return currentBroker ? this.buildStatsCardItems(currentBroker, configs) : [];
  });

  currentTab?: BrokerTabs;

  ngOnInit(): void {
    this.detailsStore.loadConfigs();
    this.brokersStore.loadBrokers();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBrokerActivate(componentRef: any) {
    const timeoutID = setTimeout(() => {
      this.currentTab = componentRef.constructor.name as BrokerTabs;
      clearTimeout(timeoutID);
    }, 100);
  }

  private buildStatsCardItems(
    infoRow: BrokerInfoRow,
    configs: BrokerConfigRow[] | undefined,
  ): StatsCardItem[] {
    const version = configs?.find((cfg) => cfg.name === 'inter.broker.protocol.version')?.value;

    return [
      { label: 'Segment Size', value: 'TODO KB' },
      { label: 'Segment Count', value: 'TODO' },
      { label: 'Port', value: infoRow.port },
      { label: 'Host', value: infoRow.host },
      {
        label: 'Version',
        value: version ?? '?',
      },
    ];
  }
}
