import { Component, OnInit } from '@angular/core';
import { StatsCard, StatsCardItem } from "../../components/stats-card/stats-card";
import { Router } from '@angular/router';
import { KafkafTable } from "../../directives/kafkaf-table";

@Component({
  selector: 'app-brokers-list',
  standalone: true,
  imports: [StatsCard, KafkafTable],
  templateUrl: './brokers-list.html',
  styleUrl: './brokers-list.scss'
})
export class BrokersList implements OnInit {

  public cardItems: StatsCardItem[] = [];

  constructor(private router: Router) {}

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

  navigateToBrokerDetails(brokerId: number): void {
    this.router.navigate([this.router.url, brokerId]);
  }
}
