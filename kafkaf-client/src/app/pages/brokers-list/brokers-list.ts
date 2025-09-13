import { Component, OnInit } from '@angular/core';
import { StatsCard, StatsCardItem } from "../../components/stats-card/stats-card";

@Component({
  selector: 'app-brokers-list',
  standalone: true,
  imports: [StatsCard],
  templateUrl: './brokers-list.html',
  styleUrl: './brokers-list.scss'
})
export class BrokersList implements OnInit {

  public cardItems: StatsCardItem[] = [];

  ngOnInit(): void {
    this.cardItems = [
      { label: 'Broker Count', value: 0, icon: 'danger' },
      { label: 'Active Controller', value: 0, icon: 'info' },
      { label: 'Version', value: 0, icon:'success' },
      { label: 'Online', value: 0, icon: 'warning' },
      { label: 'URP', value: 0 },
      { label: 'In Sync Replicas', value: 0 },
      { label: 'Out Of Sync Replicas', value: 0 }
    ];
  }
}
