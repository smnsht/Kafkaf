import { Component, input } from '@angular/core';

export type tStatsCardItemIcon = 'info' | 'success' | 'warning' | 'danger';

export interface StatsCardItem {
  label: string;
  value: string | number;
  icon?: tStatsCardItemIcon;
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss',
})
export class StatsCard {
  public cardItems = input<StatsCardItem[]>([]);
  public placeholderCount = input<number>(0);
}
