import { computed, Injectable, OnDestroy } from '@angular/core';
import { ConsumerGroupRow } from './consumer-group-row.model';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { ClusteredDataCollectionStore } from '../clustered-collection-store';


@Injectable({ providedIn: 'root' })
export class ConsumersStore extends ClusteredDataCollectionStore<ConsumerGroupRow> implements OnDestroy {

  constructor() {
    super({});
  }

  ngOnDestroy(): void {
    this.clusterIdx$.complete();
  }

  readonly consumers = computed(() => this.collection());

  protected override fetchCollection(): Observable<ConsumerGroupRow[]> {
    const clusterIdx = this.clusterIndex();

    if (Number.isNaN(clusterIdx)) {
      return of([]);
    }

    const url = `${environment.apiUrl}/clusters/${clusterIdx}/consumers`;
    return this.http.get<ConsumerGroupRow[]>(url);
  }

  loadConsumers(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
