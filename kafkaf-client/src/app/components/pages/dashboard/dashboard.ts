import { Component, computed, inject, model, OnInit, Signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ClusterInfo } from '@app/store/clusters/cluster-info.model';
import { ClustersStore } from '@app/store/clusters/clusters.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsCard, FormsModule, KafkafTableDirective, PageWrapper],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly clusters: Signal<ClusterInfo[]>;
  private readonly clustersStore = inject(ClustersStore);

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

  constructor() {
    this.clusters = this.clustersStore.clusters.asReadonly();
    this.loading = this.clustersStore.loading.asReadonly();
    this.error = this.clustersStore.error.asReadonly();
  }

  ngOnInit(): void {
    this.clustersStore.loadClustersInfo();
  }
}
