import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { Search } from '@app/components/shared/search/search/search';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { ConsumersStore } from '@app/store/consumers/consumers-store';
import { filter } from 'rxjs';

@Component({
  selector: 'page-consumers-list',
  imports: [PageWrapper, KafkafTableDirective, FormsModule, Search, RouterLink],
  templateUrl: './consumers-list.html',
})
export class ConsumersList implements OnInit {
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

  ngOnInit(): void {
    this.store.clusterIdx$
      .pipe(filter(Number.isInteger))
      .subscribe((_) => this.store.loadConsumers());
  }
}
