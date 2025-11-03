import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { BrokerInfoRow } from '@app/store/brokers/broker-info-row.model';
import { BrokersStore } from '@app/store/brokers/brokers.service';
import { ClusterInfo } from '@app/store/clusters/cluster-info.model';
import { ClustersStore } from '@app/store/clusters/clusters.service';

@Component({
  selector: 'page-brokers-list',
  standalone: true,
  imports: [StatsCard, PageWrapper, KafkafTableDirective],
  templateUrl: './brokers-list.html',
})
export class BrokersList implements OnInit {
  private readonly router = inject(Router);
  readonly brokersStore = inject(BrokersStore);
  readonly clustersStore = inject(ClustersStore);

  readonly brokersWithClusterInfo = computed(() => {
    const brokers = this.brokersStore.brokers();
    const clustersInfo = this.clustersStore.collection();

    if (brokers && clustersInfo) {
      return { brokers, clusterInfo: clustersInfo[this.brokersStore.clusterIndex()] };
    }

    return undefined;
  });

  readonly cardItems = computed(() => {
    const info = this.brokersWithClusterInfo();

    if (info) {
      return this.buildCarItems(info.brokers, info.clusterInfo);
    }

    return [];
  });

  ngOnInit(): void {
    this.clustersStore.loadClusters();
    this.brokersStore.loadBrokers();
  }

  navigateToBrokerDetails(brokerId: number): void {
    this.router.navigate([this.router.url, brokerId]);
  }

  private buildCarItems(brokers: BrokerInfoRow[], clusterInfo: ClusterInfo): StatsCardItem[] {
    const outOfSyncReplicasCount =
      clusterInfo.totalPartitionCount - clusterInfo.inSyncReplicasCount;

    return [
      {
        label: 'Broker Count',
        value: brokers.length,
        icon: brokers.length == 0 ? 'danger' : undefined,
      },
      {
        label: 'Active Controller',
        value: brokers[0]?.controller,
      },
      {
        label: 'Online Partitions',
        value: clusterInfo.isOffline
          ? 'Offline'
          : `${clusterInfo.onlinePartitionCount} of ${clusterInfo.totalPartitionCount}`,
        icon: clusterInfo.isOffline ? 'warning' : 'success',
      },
      {
        label: 'URP',
        value: clusterInfo.underReplicatedPartitionsCount,
        icon: clusterInfo.underReplicatedPartitionsCount === 0 ? 'success' : 'warning',
      },
      {
        label: 'In Sync Replicas',
        value: `${clusterInfo.inSyncReplicasCount} of ${clusterInfo.totalPartitionCount}`,
        icon: outOfSyncReplicasCount == 0 ? 'success' : 'warning',
      },
      {
        label: 'Out Of Sync Replicas',
        value: outOfSyncReplicasCount,
      },
    ];
  }
}
