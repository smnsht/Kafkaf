import { Component, OnInit } from '@angular/core';
import { StatsCard, StatsCardItem } from "../stats-card/stats-card";

@Component({
  selector: 'app-topic-tab-overview',
  imports: [StatsCard],
  templateUrl: './topic-tab-overview.html',
  // styleUrl: './topic-tab-overview.scss'
})
export class TopicTabOverview implements OnInit {
  public cardItems: StatsCardItem[] = [];

  ngOnInit(): void {
    this.cardItems = [
      { label: 'Partitions', value: 2 },
      { label: 'Replication Factor', value: 1 },
      { label: 'URP', value: 0 },
      { label: 'In Sync Replicas', value: '2 of 2' },
      { label: 'Type', value: '???' },
      { label: 'Segment Size', value: '198 Bytes' },
      { label: 'Segment Count', value: 1 },
      { label: 'Clean Up Policy', value: 'DELETE' },
      { label: 'Message Count', value: 2 },
    ];
  }
}
