import { Component } from '@angular/core';
import { KafkafTableDirective, PageWrapper } from '@app/shared';
import { TopicDetailsStore } from '../..';

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTableDirective, PageWrapper],
  templateUrl: './topic-settings.html',
})
export class TopicSettings {
  constructor(readonly store: TopicDetailsStore) {
    store.loadSettings();
  }
}
