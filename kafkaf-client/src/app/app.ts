import { Component, Signal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { ClusterInfo, ClustersStore, tKafkaSection } from './services/clusters-store';
import { ClusterSideMenu } from './components/cluster-side-menu/cluster-side-menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, RouterLink, ClusterSideMenu],
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
  }
}
