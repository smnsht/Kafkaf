import { computed, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BrokerConfigRow } from './broker-config-row.model';
import { Observable, of } from 'rxjs';
import { ClusteredDataCollectionStore2 } from '../clustered-collection-store2';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsStore extends ClusteredDataCollectionStore2<BrokerConfigRow> {
  readonly brokerId = computed(() => {
    const broker = this.secondParam() ?? '';
    return Number.parseInt(broker);
  });

  readonly logDirectores = computed(() => {
    const allConfigs = this.collection();

    if (allConfigs) {
      return allConfigs.filter((cfg) => cfg.name == 'log.dir');
    }

    return undefined;
  });

  constructor() {
    super({}, 'broker');
  }

  protected override fetchCollection(): Observable<BrokerConfigRow[]> {
    const currentClusterId = this.clusterIdx();
    const currentBrokerId = this.brokerId();

    if (Number.isNaN(currentClusterId) || Number.isNaN(currentBrokerId)) {
      return of([]);
    }

    const url = `${environment.apiUrl}/clusters/${currentClusterId}/brokers/${currentBrokerId}`;
    return this.http.get<BrokerConfigRow[]>(url);
  }

  loadConfigs(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
