import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tKafkaSection } from '@app/store/clusters/clusters-store';
import { RootStore } from '@app/store/root/root-store';

@Component({
  selector: 'app-cluster-side-menu',
  imports: [RouterLink],
  templateUrl: './cluster-side-menu.html',
  styleUrl: './cluster-side-menu.scss',
})
export class ClusterSideMenu {
  private readonly rootStore = inject(RootStore);

  kafkaSection = this.rootStore.kafkaSection.asReadonly();
  cluster = input<number>();

  isLinkActive(kafkaSection: tKafkaSection): boolean {
    return this.kafkaSection() === kafkaSection && this.cluster() === this.rootStore.clusterIndex();
  }
}
