import { computed, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';
import { TopicSettingRow } from './topic-setting-row.model';

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

  loadTopicSettings$(clusterIdx: number, topicName: string): Observable<TopicSettingRow[]> {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/settings`;
    return this.http.get<TopicSettingRow[]>(url);
  }

  patchSetting(model: { name: string; value: string }) {
    this.setLoading(true);

    const url = `${this.getResourceUrl()}/settings/${model.name}`;
    const noticeHandler = this.withNoticeHandling(() => `Setting ${model.name} updated.`);

    return this.http.patch<void>(url, model).pipe(noticeHandler);
  }
}
