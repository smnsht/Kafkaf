import { computed, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BrokerInfoRow, ItemIdPK } from '../store/models';
import { BaseStore } from './base-store';

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
    return `${environment.apiUrl}/clusters/${clusterIdx}/brokers/${brokerId}`;
  }

  protected override getItemKey(item: BrokerInfoRow): string | number {
    return item.brokerID;
  }
}
