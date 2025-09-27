import { Component, Signal } from '@angular/core';
import { KafkafTable } from '../../directives/kafkaf-table';
import { BrokerConfigRow, BrokerDetailsStore } from '../../services/broker-details-store';

@Component({
  selector: 'app-broker-configs',
  imports: [KafkafTable],
  templateUrl: './broker-configs.html',
  // styleUrl: './broker-configs.scss'
})
export class BrokerConfigs {

  configs: Signal<BrokerConfigRow[] | undefined>;

  constructor(store: BrokerDetailsStore){
    this.configs = store.configs;
  }
}
