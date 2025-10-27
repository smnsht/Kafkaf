import { computed, Injectable } from '@angular/core';
import { BrokerConfigRow } from './broker-config-row.model';
import { Observable } from 'rxjs';
import { SectionedDataCollectionStore } from '../sectioned-collection-store';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsStore extends SectionedDataCollectionStore<BrokerConfigRow> {
  readonly brokerId = computed(() => {
    const broker = this.kafkaSectionValue() ?? '';
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
    super({});
  }

  protected override fetchCollection(): Observable<BrokerConfigRow[]> {
    const url = this.getResourceUrl();
    return this.http.get<BrokerConfigRow[]>(url);
  }

  loadConfigs(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
