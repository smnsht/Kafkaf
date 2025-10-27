import { computed, Injectable, OnDestroy } from '@angular/core';
import { BrokerInfoRow } from './broker-info-row.model';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';
import { Observable } from 'rxjs';

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
