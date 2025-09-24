import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PageState } from './base-store';

export interface BrokerConfigRow {
  isDefault: boolean;
  isReadOnly: boolean;
  isSensitive: boolean;
  name: string;
  value: string;
  source: string;
}

export interface ClusterBroker {
  clusterIdx: number;
  brokerId: number;
}

interface BrokerDetailsState {
  configs: Map<string, BrokerConfigRow[]>;
  currentClusterId: number;
  currentBrokerId: number;
  loading?: boolean;
  error?: string;
}

const defaultState: BrokerDetailsState = {
  configs: new Map<string, BrokerConfigRow[]>(),
  currentClusterId: NaN,
  currentBrokerId: NaN,
};

function makeKey(val: ClusterBroker): string {
  return `${val.clusterIdx},${val.brokerId}`;
}

function parseConfigRowKey(str: string): ClusterBroker {
  const [cluster, broker] = str.split(',', 2);
  return {
    clusterIdx: parseInt(cluster),
    brokerId: parseInt(broker),
  };
}

@Injectable({
  providedIn: 'root',
})
export class BrokerDetailsStore {
  private readonly http = inject(HttpClient);
  private readonly state = signal<BrokerDetailsState>({ ...defaultState });

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  readonly configs = computed(() => {
    const { configs, currentClusterId, currentBrokerId } = this.state();
    if (!isNaN(currentClusterId) && !isNaN(currentBrokerId)) {
      const key = makeKey({
        clusterIdx: currentClusterId,
        brokerId: currentBrokerId,
      });

      return configs.get(key);
    }

    return undefined;
  });

  readonly logDirectores = computed(() => {
    const allConfigs = this.configs();
    if (allConfigs) {
      return allConfigs.filter((cfg) => cfg.name == 'log.dirs');
    }

    return undefined;
  });

  readonly configsKeys = computed(() => {
    const keys = this.state().configs.keys();
    return Array.from(keys).map((key) => parseConfigRowKey(key));
  });

  readonly pageState = computed<PageState>(() => {
    const { loading, error } = this.state();
    return { loading, error };
  });

  public loadConfigs(val: ClusterBroker): void {
    const key = makeKey(val);

    if (!this.state().configs.has(key)) {
      this.state.update((state) => {
        return {
          ...state,
          currentClusterId: val.clusterIdx,
          currentBrokerId: val.brokerId,
          loading: true,
          error: undefined,
        };
      });

      this.fetchConfigs();
    }
  }

  private fetchConfigs(): void {
    const { currentClusterId, currentBrokerId } = this.state();
    const url = `${environment.apiUrl}/clusters/${currentClusterId}/brokers/${currentBrokerId}`;

    this.http.get<BrokerConfigRow[]>(url).subscribe({
      next: (data) => {
        this.state.update((state) => {
          const { configs } = state;
          const key = makeKey({
            clusterIdx: currentClusterId,
            brokerId: currentBrokerId,
          });
          configs.set(key, data);

          return {
            ...state,
            configs: configs,
            loading: false,
          };
        });
      },
      error: (err: HttpErrorResponse) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: err.message,
        }));
      },
    });
  }
}
