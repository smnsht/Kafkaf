import { Component, computed, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ClustersStore } from '@app/store/clusters/clusters-store';

interface Stats {
  online: number;
  offline: number;
}

@Component({
  selector: 'page-dashboard',
  standalone: true,
  imports: [StatsCard, FormsModule, KafkafTableDirective, PageWrapper],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  readonly store = inject(ClustersStore);
  readonly onlyOfflineClusters = model(false);

  public cardItems = computed(() => {
    const clusters = this.store.collection();
    const stats: Stats | undefined = clusters?.reduce(
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

    return this.buildStatsCardItems(stats);
  });

  public clustersForDisplay = computed(() => {
    const all = this.store.collection();
    const onlyOffline = this.onlyOfflineClusters();
    return onlyOffline ? all?.filter((c) => c.isOffline) : all;
  });

  ngOnInit(): void {
    this.store.loadClusters();
  }

  private buildStatsCardItems(stats: Stats | undefined): StatsCardItem[] {
    if (!stats) {
      return [];
    }

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
  }
}
