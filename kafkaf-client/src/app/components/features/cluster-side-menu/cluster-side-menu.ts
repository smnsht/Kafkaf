import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { tKafkaSection } from '@app/store/clusters/cluster-info.model';


@Component({
  selector: 'app-cluster-side-menu',
  imports: [RouterLink],
  templateUrl: './cluster-side-menu.html',
  styleUrl: './cluster-side-menu.scss',
})
export class ClusterSideMenu {
  kafkaSection = input<tKafkaSection>();
  cluster = input<number>();
}
