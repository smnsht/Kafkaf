import { Component, inject } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTableDirective, PageWrapper],
  templateUrl: './topic-settings.html',
})
export class TopicSettings {
  readonly store = inject(TopicDetailsStore);

  selectedRowIndex = -1;

  constructor() {
    this.store.loadSettings();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(name: string, value: any): void {
    this.store.patchSetting({ name: name, value: value }).subscribe(() => {
      this.selectedRowIndex = -1;
    });
  }
}
