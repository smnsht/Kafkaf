import { Component } from '@angular/core';
import { KafkafTable } from "../../directives/kafkaf-table";

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTable],
  templateUrl: './topic-settings.html',
  // styleUrl: './topic-settings.scss'
})
export class TopicSettings {

}
