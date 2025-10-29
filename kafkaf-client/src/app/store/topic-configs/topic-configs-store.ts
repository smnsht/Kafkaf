import { computed, Injectable } from '@angular/core';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';
import { Observable } from 'rxjs';

export interface TopicConfigRow {
  key: string;
  type: string;
  defaultValue: string;
}

@Injectable({
  providedIn: 'root',
})
export class TopicConfigsStore extends ClusteredDataCollectionStore<TopicConfigRow> {
  readonly configs = computed(() => this.collection());

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<TopicConfigRow[]> {
    const url = this.getBaseResourceUrl();
    console.log(url);
    return this.http.get<TopicConfigRow[]>(url);
  }

  loadConfigs(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
