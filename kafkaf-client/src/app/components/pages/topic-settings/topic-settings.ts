import { Component } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';

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
    this.store.patchSetting({ name: name, value: value }).subscribe(() => {
      this.selectedRowIndex = -1;
    });
  }
}
