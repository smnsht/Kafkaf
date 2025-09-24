import { Component } from '@angular/core';
import { KafkafTable } from '../../directives/kafkaf-table';

@Component({
  selector: 'app-broker-log-directories',
  imports: [KafkafTable],
  templateUrl: './broker-log-directories.html',
  // styleUrl: './broker-log-directories.scss'
})
export class BrokerLogDirectories {

}
