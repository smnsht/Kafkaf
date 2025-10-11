import { Component, input } from '@angular/core';
import { StatsCardItem } from '../../models/stats-cardI-iem';

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
