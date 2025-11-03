import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsumersStore } from '@app/store/consumers/consumers-store';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { StatsCard, StatsCardItem } from '@app/components/shared/stats-card/stats-card';
import { Search } from '@app/components/shared/search/search/search';
import { ConsumerGroupRow } from '@app/models/consumer.models';

const defaultCardItems: readonly StatsCardItem[] = [
  { label: 'State', value: '?' },
  { label: 'Members', value: '?' },
  { label: 'Assigned Topics', value: '?' },
  { label: 'Assigned Partitions', value: '?' },
  { label: 'Coordinator ID', value: '?' },
  { label: 'Total lag', value: '?' },
];

@Component({
  selector: 'app-consumer-details',
  imports: [RouterLink, PageWrapper, KafkafTableDirective, StatsCard, Search],
  templateUrl: './consumer-details.html',
  styleUrl: './consumer-details.scss',
})
export class ConsumerDetails implements OnInit {
  readonly store = inject(ConsumersStore);
  readonly route = inject(ActivatedRoute);

  readonly consumerParam = signal<string | undefined>(undefined);
  readonly search = signal('');

  readonly consumer = computed(() => {
    const groupId = this.consumerParam();
    const consumers = this.store.consumers();

    if (groupId && consumers) {
      return consumers.find((c) => c.groupId === groupId);
    }

    return undefined;
  });

  readonly partitions = computed(() => {
    const consumer = this.consumer();
    const search = this.search().toLowerCase();

    return consumer?.partitions.filter((part) => {
      if (search) {
        return part.topic.toLowerCase().includes(search);
      }

      return true;
    });
  });

  readonly cardItems = computed<StatsCardItem[]>(() => {
    const consumer = this.consumer();

    if (consumer) {
      return this.buildCarItems(consumer);
    }

    return [...defaultCardItems];
  });

  cluster = 0;

  ngOnInit(): void {
    this.store.loadConsumers();
    this.route.paramMap.subscribe((params) => {
      this.cluster = Number.parseInt(params.get('cluster')!);
      this.consumerParam.set(params.get('consumer')!);
    });
  }

  private buildCarItems(consumer: ConsumerGroupRow): StatsCardItem[] {
    const cardItems = [...defaultCardItems];

    // State
    cardItems[0] = {
      ...cardItems[0],
      value: consumer.state,
    };

    // Members
    cardItems[1] = {
      ...cardItems[1],
      value: consumer.numberOfMembers,
    };

    // Assigned Topics
    cardItems[2] = {
      ...cardItems[2],
      value: consumer.numberOfTopics,
    };

    // Assigned Partitions
    cardItems[3] = {
      ...cardItems[3],
      value: consumer.partitions.length,
    };

    // Coordinator ID
    cardItems[4] = {
      ...cardItems[4],
      value: consumer.coordinator,
    };

    // Total lag
    cardItems[5] = {
      ...cardItems[5],
      value: consumer.consumerLag,
    };

    return cardItems;
  }
}
