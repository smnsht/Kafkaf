import { Component } from '@angular/core';
import { KafkafTable } from "../../directives/kafkaf-table";
import { TopicDetailsStore } from '../../services/topic-details-store';
import { PageWrapper } from "../../shared/components/page-wrapper/page-wrapper";

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTable, PageWrapper],
  templateUrl: './topic-settings.html',
})
export class TopicSettings {
  constructor(readonly store: TopicDetailsStore){
    store.loadSettings()
  }
}
