import { Component, OnInit } from '@angular/core';
import { StatsCard, StatsCardItem } from '../../components/stats-card/stats-card';
import { KafkafTable } from '../../directives/kafkaf-table';

@Component({
  selector: 'app-topic-overview',
  imports: [StatsCard,  KafkafTable],
  templateUrl: './topic-overview.html',
  // styleUrl: './topic-overview.scss'
})
export class TopicOverview implements OnInit {
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
