import { computed, Injectable, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { BrokerInfoRow } from './broker-info-row.model';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrokersStore extends ClusteredDataCollectionStore<BrokerInfoRow> implements OnDestroy {

  readonly brokers = computed(() => this.collection() );

  constructor() {
    super({});
  }

  protected override fetchCollection(): Observable<BrokerInfoRow[]> {
    const clusterIdx = this.clusterIdx();

    if (Number.isNaN(clusterIdx)) {
      return of([]);
    }

    const url = `${environment.apiUrl}/clusters/${clusterIdx}/brokers`;
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
