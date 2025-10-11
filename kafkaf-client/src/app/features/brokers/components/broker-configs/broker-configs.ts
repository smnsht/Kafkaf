import { Component } from '@angular/core';
import { BrokerDetailsStore } from '../../store/broker-details/broker-details';
import { KafkafTableDirective } from '@app/shared/directives/kafkaf-table/kafkaf-table';

@Component({
  selector: 'app-broker-configs',
  imports: [KafkafTableDirective],
  templateUrl: './broker-configs.html',
})
export class BrokerConfigs {
  constructor(public store: BrokerDetailsStore) {}
}
