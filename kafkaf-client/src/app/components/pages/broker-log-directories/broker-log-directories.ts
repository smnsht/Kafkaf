import { Component, inject } from '@angular/core';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { BrokerDetailsStore } from '@app/store/broker-details/broker-details-store';

@Component({
  selector: 'app-broker-log-directories',
  imports: [KafkafTableDirective],
  templateUrl: './broker-log-directories.html',
})
export class BrokerLogDirectories {
  store = inject(BrokerDetailsStore);
}
