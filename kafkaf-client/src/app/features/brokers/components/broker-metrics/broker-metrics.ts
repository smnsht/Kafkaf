import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-broker-metrics',
  imports: [JsonPipe],
  templateUrl: './broker-metrics.html',
})
export class BrokerMetrics {
  public metrics: object = {
    metrics: [],
  };
}
