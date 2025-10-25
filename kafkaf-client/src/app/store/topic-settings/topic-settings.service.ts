import { computed, Injectable } from '@angular/core';
import { ClusteredDataCollectionStore2 } from '../clustered-collection-store2';
import { TopicSettingRow } from './topic-setting-row.model';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopicSettingsStore extends ClusteredDataCollectionStore2<TopicSettingRow> {
  readonly topicName = computed(() => this.secondParam());
  readonly settings = computed(() => this.collection());

  constructor() {
    super({}, 'topic');
  }

  protected override fetchCollection(): Observable<TopicSettingRow[]> {
    const topicName = this.secondParam();

    if (!topicName) {
      this.logger.warn("Can't obtain topicName (second parameter)");
      return of([]);
    }

    const clusterIdx = this.clusterIdx();

    if (Number.isNaN(clusterIdx)) {
      this.logger.warn("Can't obtain clusterIdx");
      return of([]);
    }

    return this.loadTopicSettings(clusterIdx, topicName);
  }

  loadSettings(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }

  loadTopicSettings(clusterIdx: number, topicName: string): Observable<TopicSettingRow[]> {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/settings`;
    return this.http.get<TopicSettingRow[]>(url);
  }
}
