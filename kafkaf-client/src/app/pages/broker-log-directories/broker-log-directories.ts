import { Component, Signal } from '@angular/core';
import { KafkafTable } from '../../directives/kafkaf-table';
import { BrokerConfigRow, BrokerDetailsStore } from '../../services/broker-details-store';

@Component({
  selector: 'app-broker-log-directories',
  imports: [KafkafTable],
  templateUrl: './broker-log-directories.html',
  // styleUrl: './broker-log-directories.scss'
})
export class BrokerLogDirectories {
  logDirectores: Signal<BrokerConfigRow[] | undefined>;

  constructor(store: BrokerDetailsStore){
    this.logDirectores = store.logDirectores;
  }
}
