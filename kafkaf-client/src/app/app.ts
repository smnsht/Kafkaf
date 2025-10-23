import { Component, Signal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './components/features/navbar/navbar';
import { ClusterSideMenu } from './components/features/cluster-side-menu/cluster-side-menu';
import { ClusterInfo, tKafkaSection } from './store/clusters/cluster-info.model';
import { ClustersStore } from './store/clusters/clusters.service';
import { ConfirmationModal } from './components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, RouterLink, ClusterSideMenu, ConfirmationModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('kafkaf-client');

  public clusters: Signal<ClusterInfo[]>;
  public loading: Signal<boolean>;
  public cluster: Signal<number>;
  public kafkaSection: Signal<tKafkaSection>;

  constructor(clustersStore: ClustersStore) {
    this.clusters = clustersStore.clusters.asReadonly();
    this.loading = clustersStore.loading.asReadonly();
    this.cluster = clustersStore.clusterIndex.asReadonly();
    this.kafkaSection = clustersStore.kafkaSection.asReadonly();

    if (this.clusters().length == 0) {
      clustersStore.loadClustersInfo();
    }
  }
}
