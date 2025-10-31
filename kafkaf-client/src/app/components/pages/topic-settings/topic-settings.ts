import { Component, computed, inject, signal } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicSettingsStore } from '@app/store/topic-settings/topic-settings-store';
import { Search } from "@app/components/shared/search/search/search";
import { TopicSettingInput } from "@app/components/features/topic-setting-input/topic-setting-input";

@Component({
  selector: 'app-topic-settings',
  imports: [KafkafTableDirective, PageWrapper, Search, TopicSettingInput],
  templateUrl: './topic-settings.html',
})
export class TopicSettings {
  readonly store = inject(TopicSettingsStore);
  readonly search = signal('');

  readonly filteredSettings = computed(() => {
    const settings = this.store.settings();
    const search = this.search().toLowerCase();

    return settings?.filter(s => {
      if (search) {
        if (s.name.toLowerCase().includes(search)) {
          return true;
        }

        if (s.value.toLocaleLowerCase().includes(search)) {
          return true;
        }

        return false;
      }

      return true;
    });
  });

  selectedRowIndex = -1;

  constructor() {
    this.store.loadSettings();
  }

  update(name: string, value: string | undefined): void {
    if(!value) {
      this.store.setError('Value is empyt!', 5000);
      return;
    }

    this.store.patchSetting({ name: name, value: value }).subscribe(() => {
      this.selectedRowIndex = -1;
      this.store.reloadSettings();
    });
  }
}
