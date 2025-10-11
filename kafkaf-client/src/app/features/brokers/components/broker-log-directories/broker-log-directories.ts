import { Component } from '@angular/core';
import { KafkafTable } from '../../directives/kafkaf-table';
import { BrokerDetailsStore } from '../../services/broker-details-store';

@Component({
  selector: 'app-broker-log-directories',
  imports: [KafkafTable],
  templateUrl: './broker-log-directories.html',
  // styleUrl: './broker-log-directories.scss'
})
export class BrokerLogDirectories {

  constructor(public store: BrokerDetailsStore){}
}
