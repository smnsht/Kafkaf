import { computed, Injectable, OnDestroy } from '@angular/core';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';
import { Observable } from 'rxjs';
import { BrokerInfoRow } from '@app/models/broker.models';

@Injectable({
  providedIn: 'root',
})
export class BrokersStore extends ClusteredDataCollectionStore<BrokerInfoRow> implements OnDestroy {
  readonly brokers = computed(() => this.collection());

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<BrokerInfoRow[]> {
    const url = `${this.getBaseResourceUrl()}/brokers`;
    return this.http.get<BrokerInfoRow[]>(url);
  }

  ngOnDestroy(): void {
    this.clusterIdx$.complete();
  }

  loadBrokers(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
