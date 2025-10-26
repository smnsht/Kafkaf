import { Component, inject } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicSettingsStore } from '@app/store/topic-settings/topic-settings.service';

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTableDirective, PageWrapper],
  templateUrl: './topic-settings.html',
})
export class TopicSettings {
  readonly store = inject(TopicSettingsStore);

  selectedRowIndex = -1;

  constructor() {
    this.store.loadSettings();
  }

  update(name: string, value: string): void {
    console.log('name & value: ', name, value);
    this.store.patchSetting({ name: name, value: value }).subscribe(() => {
      this.selectedRowIndex = -1;
      this.store.reloadSettings();
    });
  }
}
