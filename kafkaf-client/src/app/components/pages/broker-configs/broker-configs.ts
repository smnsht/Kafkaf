import { Component, computed, signal } from '@angular/core';
import { Search } from '@app/components/shared/search/search/search';
import { KafkafTableDirective } from '@app/directives/kafkaf-table/kafkaf-table';
import { BrokerDetailsStore } from '@app/store/broker-details/broker-details.service';

@Component({
  selector: 'app-broker-configs',
  imports: [KafkafTableDirective, Search],
  templateUrl: './broker-configs.html',
})
export class BrokerConfigs {
  search = signal('');

  configs = computed(() => {
    const search = this.search().toLowerCase();
    const configs = this.store.configs();

    return configs?.filter((cfg) => cfg.name.toLowerCase().includes(search));
  });

  constructor(public store: BrokerDetailsStore) {}
}
