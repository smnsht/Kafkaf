import { computed, Injectable } from '@angular/core';
import { BaseStore, ItemIdPK } from '@app/shared';
import { ConsumerGroupRow } from '../../models/consumer-group-row';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsumersStore extends BaseStore<ConsumerGroupRow> {
  constructor() {
    super();
  }

  readonly consumers = computed(() => this.currentItems());

  protected override resourceUrl(clusterIdx: number): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/consumers`;
  }
  protected override resourceItemUrl(clusterIdx: number, itemId: ItemIdPK): string {
    throw new Error('Method not implemented.');
  }
  protected override getItemKey(item: ConsumerGroupRow): string | number {
    return item.groupId;
  }
}
