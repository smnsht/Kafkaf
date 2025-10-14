import { Component, computed, signal } from '@angular/core';
import { KafkafTableDirective, PageWrapper, Search } from '@app/shared';
import { TopicDetailsStore } from '../..';

@Component({
  selector: 'app-topic-consumers',
  imports: [KafkafTableDirective, PageWrapper, Search],
  templateUrl: './topic-consumers.html',
})
export class TopicConsumers {
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

  constructor(readonly store: TopicDetailsStore) {
    store.loadConsumers();
  }
}
