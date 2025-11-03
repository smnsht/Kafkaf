import { computed, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';

export interface TopicSettingRow {
  name: string;
  value: string;
  defaultValue?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TopicSettingsStore extends SectionedDataCollectionStore<TopicSettingRow> {
  readonly topicName = computed(() => this.kafkaSection());
  readonly settings = computed(() => this.collection());

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<TopicSettingRow[]> {
    const url = `${this.getResourceUrl()}/settings`;

    return this.http.get<TopicSettingRow[]>(url);
  }

  loadSettings(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }

  reloadSettings(): void {
    this.loadCollection();
  }

  patchSetting(model: { name: string; value: string }) {
    this.setLoading(true);

    const url = `${this.getResourceUrl()}/settings/${model.name}`;
    const noticeHandler = this.withNoticeHandling(() => `Setting ${model.name} updated.`);
    const payload = {
      ...model,
      value: String(model.value),
    };

    return this.http.patch<void>(url, payload).pipe(noticeHandler);
  }
}
