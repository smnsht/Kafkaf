import { computed, Injectable } from '@angular/core';
import { TopicConsumersRow } from '../topic-detais/topic-consumers-row.model';
import { Observable } from 'rxjs';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';

@Injectable({
  providedIn: 'root'
})
export class TopicConsumersStore extends SectionedDataCollectionStore<TopicConsumersRow> {
  readonly consumers = computed(() => this.collection());

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<TopicConsumersRow[]> {
    const url = `${this.getResourceUrl()}/consumers`;
    return this.http.get<TopicConsumersRow[]>(url);
  }

  loadConsumers(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
