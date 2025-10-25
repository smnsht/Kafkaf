import { Component, computed, inject, signal } from '@angular/core';
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
  private readonly route = inject(ActivatedRoute);

  readonly store = inject(ConsumersStore);
  readonly search = signal('');

  consumers = computed(() => {
    const searchStr = this.search().toLowerCase();
    const allConsumers = this.store.collection();

    return allConsumers?.filter((consumer) => {
      const group = consumer.groupId.toLowerCase();
      return group.includes(searchStr);
    });
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.store.handleParamMapChange(params);
      this.store.loadConsumers();
    });
  }
}
