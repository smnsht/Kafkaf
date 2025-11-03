import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './components/features/navbar/navbar';
import { ClusterSideMenu } from './components/features/cluster-side-menu/cluster-side-menu';
import { ClustersStore } from './store/clusters/clusters-store';
import { ConfirmationModal } from './components/shared/confirmation-modal/confirmation-modal';
import { RootStore } from './store/root/root-store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, RouterLink, ClusterSideMenu, ConfirmationModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('kafkaf-client');

  readonly clustersStore = inject(ClustersStore);
  readonly rootStore = inject(RootStore);

  constructor() {
    this.clustersStore.loadClusters();
  }
}
