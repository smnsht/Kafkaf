import { Component } from '@angular/core';
import { StatsCard } from "../../components/stats-card/stats-card";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
