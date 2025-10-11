import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KafkafTableDirective, PageWrapper } from '@app/shared';
import { TopicDetailsStore } from '../..';

@Component({
  selector: 'app-topic-consumers',
  imports: [FormsModule, KafkafTableDirective, PageWrapper],
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
