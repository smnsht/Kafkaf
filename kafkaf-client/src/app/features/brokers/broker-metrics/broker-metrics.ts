import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-broker-metrics',
  imports: [JsonPipe],
  templateUrl: './broker-metrics.html',
  // styleUrl: './broker-metrics.scss'
})
export class BrokerMetrics {
  public metrics: object = {
    metrics: []
  }
}
