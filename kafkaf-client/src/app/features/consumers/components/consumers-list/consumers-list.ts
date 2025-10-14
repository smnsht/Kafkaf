import { Component, computed, signal } from '@angular/core';

import { KafkafTableDirective, PageWrapper, Search } from '@app/shared';
import { ConsumersStore } from '../../store/consumers';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'page-consumers-list',
  imports: [PageWrapper, KafkafTableDirective, FormsModule, Search],
  templateUrl: './consumers-list.html',
})
export class ConsumersList {
  search = signal('');

  consumers = computed(() => {
    const searchStr = this.search().toLowerCase();
    const allConsumers = this.store.consumers();

    return allConsumers?.filter((consumer) => consumer.groupId.toLowerCase().includes(searchStr));
  });

  constructor(
    readonly route: ActivatedRoute,
    readonly store: ConsumersStore,
  ) {
    route.paramMap.subscribe((params) => {
      const cluster = Number.parseInt(params.get('cluster')!);
      store.selectCluster(cluster);
      store.loadCollection();
    });
  }
}
