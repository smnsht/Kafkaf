import { Component, computed, signal } from '@angular/core';
import { KafkafTableDirective, Search } from '@shared/index';
import { BrokerDetailsStore } from '@brokers/store/broker-details/broker-details';

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
