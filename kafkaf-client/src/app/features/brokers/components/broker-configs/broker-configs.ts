import { Component } from '@angular/core';
import { KafkafTableDirective } from '@shared/index';
import { BrokerDetailsStore } from '@brokers/store/broker-details/broker-details';

@Component({
  selector: 'app-broker-configs',
  imports: [KafkafTableDirective],
  templateUrl: './broker-configs.html',
})
export class BrokerConfigs {
  constructor(public store: BrokerDetailsStore) {}
}
