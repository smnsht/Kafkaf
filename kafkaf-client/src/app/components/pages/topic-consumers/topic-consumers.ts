import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { Search } from '@app/components/shared/search/search/search';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ConsumersStore } from '@app/store/consumers/consumers.service';

@Component({
  selector: 'app-topic-consumers',
  imports: [KafkafTableDirective, PageWrapper, Search, RouterLink],
  templateUrl: './topic-consumers.html',
})
export class TopicConsumers implements OnInit {
  readonly store = inject(ConsumersStore);
  readonly route = inject(ActivatedRoute);

  readonly search = signal('');
  readonly topic = signal<string | null>(null);
  readonly cluster = signal<string | null>(null);

  readonly consumersForTopic = computed(() => {
    const topic = this.topic();
    const consumers = this.store.collection();

    if (topic && consumers) {
      return consumers
        .map((consumer) => {
          consumer.partitions = consumer.partitions.filter((p) => p.topic === topic);
          return consumer;
        })
        .filter((consumer) => consumer.partitions.length > 0);
    }

    return [];
  });

  consumers = computed(() => {
    const search = this.search().toLocaleLowerCase();
    const consumers = this.consumersForTopic();

    return consumers.filter((consumer) => {
      if (search) {
        const groupId = consumer.groupId.toLowerCase();
        return groupId.includes(search);
      }
      return true;
    });
  });

  ngOnInit(): void {
    this.store.loadConsumers();

    this.route.parent?.paramMap.subscribe((params) => {
      this.topic.set(params.get('topic'));
      this.cluster.set(params.get('cluster'));
    });
  }
}
