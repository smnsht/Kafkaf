import { Component } from '@angular/core';
import { KafkafTable } from '../../directives/kafkaf-table';

@Component({
  selector: 'app-broker-configs',
  imports: [KafkafTable],
  templateUrl: './broker-configs.html',
  // styleUrl: './broker-configs.scss'
})
export class BrokerConfigs {

}
