import { Component, OnInit } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsCard, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public cardItems: StatsCardItem[] = [];
  public onlyOfflineClusters = false;

  ngOnInit(): void {
    this.cardItems = [
      { label: 'Online', value: '1 cluster', icon: 'success' },
      { label: 'Offline', value: '1 cluster', icon: 'info' },
    ];
  }
}
