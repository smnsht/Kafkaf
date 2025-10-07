import { Component, computed, model, OnInit, Signal } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { FormsModule } from '@angular/forms';
import { KafkafTable } from '../../directives/kafkaf-table';
import { ClusterInfo, ClustersStore } from '../../services/clusters-store';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsCard, FormsModule, KafkafTable, PageWrapper],
  templateUrl: './dashboard.html',
  // styleUrl: './dashboard.scss',
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
      { online: 0, offline: 0 }
    );

    const retval: StatsCardItem[] = [
      {
        label: 'Online',
        value: stats.online == 1 ? '1 cluster' : `${stats.online} clusters`,
        icon: stats.online == 0 ? 'warning' : 'success'
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
