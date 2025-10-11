import { computed, Injectable } from '@angular/core';

import { BaseStore, ItemIdPK } from 'app/shared/store/base-store';
import { environment } from 'environments/environment';
import { BrokerInfoRow } from '@features/brokers/models/broker-info-row';

@Injectable({
  providedIn: 'root',
})
export class BrokersStore extends BaseStore<BrokerInfoRow> {
  constructor() {
    super({});
  }

  readonly brokers = computed(() => this.currentItems());

  protected override resourceUrl(clusterIdx: number): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/brokers`;
  }

  protected override resourceItemUrl(clusterIdx: number, brokerId: ItemIdPK): string {
    return `${this.resourceUrl(clusterIdx)}/${brokerId}`;
  }

  protected override getItemKey(item: BrokerInfoRow): string | number {
    return item.brokerID;
  }
}
