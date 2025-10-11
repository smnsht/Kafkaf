import { Component, computed, model, OnInit, Signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { KafkafTableDirective, PageWrapper, StatsCard, StatsCardItem } from '@app/shared';
import {  ClustersStore } from '../../store/clusters';
import { ClusterInfo } from '../../models/cluster-info';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsCard, FormsModule, KafkafTableDirective, PageWrapper],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private clusters: Signal<ClusterInfo[]>;

  public onlyOfflineClusters = model(false);
  public loading: Signal<boolean>;
  public error: Signal<string | null>;

  public cardItems = computed(() => {
    const stats = this.clusters().reduce(
      (acc, info) => {
        if (info.isOffline) {
          acc.offline += 1;
        } else {
          acc.online += 1;
        }
        return acc;
      },
      { online: 0, offline: 0 },
    );

    const retval: StatsCardItem[] = [
      {
        label: 'Online',
        value: stats.online == 1 ? '1 cluster' : `${stats.online} clusters`,
        icon: stats.online == 0 ? 'warning' : 'success',
      },
      {
        label: 'Offline',
        value: stats.offline == 1 ? '1 cluster' : `${stats.offline} clusters`,
        icon: stats.offline == 0 ? 'info' : 'warning',
      },
    ];

    return retval;
  });

  public clustersForDisplay = computed(() => {
    const all = this.clusters();
    const onlyOffline = this.onlyOfflineClusters();
    return onlyOffline ? all.filter((c) => c.isOffline) : all;
  });

  constructor(private readonly clustersStore: ClustersStore) {
    this.clusters = clustersStore.clusters.asReadonly();
    this.loading = clustersStore.loading.asReadonly();
    this.error = clustersStore.error.asReadonly();
  }

  ngOnInit(): void {
    this.clustersStore.loadClustersInfo();
  }
}
