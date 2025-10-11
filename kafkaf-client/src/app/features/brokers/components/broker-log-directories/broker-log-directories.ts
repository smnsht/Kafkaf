import { Component } from '@angular/core';
import { KafkafTableDirective } from '@app/shared';
import { BrokerDetailsStore } from '../../store/broker-details/broker-details';

@Component({
  selector: 'app-broker-log-directories',
  imports: [KafkafTableDirective],
  templateUrl: './broker-log-directories.html',
})
export class BrokerLogDirectories {
  constructor(public store: BrokerDetailsStore) {}
}
