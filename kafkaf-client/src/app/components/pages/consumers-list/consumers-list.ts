import { Component, computed, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { Search } from '@app/components/shared/search/search/search';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ConsumersStore } from '@app/store/consumers/consumers.service';

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
