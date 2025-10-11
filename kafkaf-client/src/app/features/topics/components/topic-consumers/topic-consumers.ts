import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KafkafTable } from '../../directives/kafkaf-table';
import { TopicDetailsStore } from '../../services/topic-details-store';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';

@Component({
  selector: 'app-topic-consumers',
  imports: [FormsModule, KafkafTable, PageWrapper],
  templateUrl: './topic-consumers.html',
  // styleUrl: './topic-consumers.scss'
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
