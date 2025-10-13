import { Component } from '@angular/core';
import { KafkafTableDirective, PageWrapper } from '@app/shared';
import { TopicDetailsStore } from '../..';

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTableDirective, PageWrapper],
  templateUrl: './topic-settings.html',
})
export class TopicSettings {
  selectedRowIndex = -1;

  constructor(readonly store: TopicDetailsStore) {
    store.loadSettings();
  }

  update(name: string, value: any): void {
    this.store.updateSetting({ name: name, value: value }).subscribe(() => {
      this.selectedRowIndex = -1;
    });
  }
}
