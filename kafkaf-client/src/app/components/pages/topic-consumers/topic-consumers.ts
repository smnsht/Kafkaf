import { Component, signal, computed, inject } from '@angular/core';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { Search } from '@app/components/shared/search/search/search';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { TopicDetailsStore } from '@app/store/topic-detais/topic-details.service';

@Component({
  selector: 'app-topic-consumers',
  imports: [KafkafTableDirective, PageWrapper, Search],
  templateUrl: './topic-consumers.html',
})
export class TopicConsumers {
  readonly store = inject(TopicDetailsStore);
  search = signal('');

  consumers = computed(() => {
    const search = this.search().toLocaleLowerCase();
    const allConsumers = this.store.consumers() ?? [];

    return allConsumers.filter((consumer) => {
      if (search) {
        const groupId = consumer.groupId.toLowerCase();
        return groupId.includes(search);
      }
      return true;
    });
  });

  constructor() {
    this.store.loadConsumers();
  }
}
