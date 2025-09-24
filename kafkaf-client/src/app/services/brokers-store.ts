import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PageState } from './base-store';

export interface BrokerInfoRow {
  brokerID: number;
  port: number;
  host: string;
}

export interface BrokersInfoView {
  controller: number;
  brokers: BrokerInfoRow[];
}

interface BrokersState {
  brokersInfo: Map<number, BrokersInfoView>;
  loading?: boolean;
  error?: string;
}

const defaultState: BrokersState = {
  brokersInfo: new Map<number, BrokersInfoView>(),
};

@Injectable({
  providedIn: 'root',
})
export class BrokersStore {
  private readonly http = inject(HttpClient);
  private readonly state = signal<BrokersState>({ ...defaultState });

  readonly brokersInfo = computed(() => this.state().brokersInfo);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  readonly brokersKeys = computed(() => {
    const keys = this.state().brokersInfo.keys();
    return Array.from(keys);
  });

  readonly pageState = computed<PageState>(() => {
    const { loading, error } = this.state();
    return { loading, error };
  });

  brokersInfoFor(clusterIdxSignal: () => number) {
    return computed(() => {
      const idx = clusterIdxSignal();
      const keys = this.brokersKeys();

      if (isNaN(idx) || idx < 0 || !keys.includes(idx)) {
        return undefined;
      }

      return this.brokersInfo().get(idx);
    });
  }

  public loadBrokers(clusterIdx: number): boolean {
    const keys = this.brokersKeys();

    if (clusterIdx >= 0 && !keys.includes(clusterIdx)) {
      this.state.update((state) => {
        return {
          ...state,
          loading: true,
          clusterIdx: clusterIdx,
        };
      });

      this.fetchBrokers(clusterIdx);

      return true;
    }

    return false;
  }

  private fetchBrokers(clusterIdx: number): void {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/brokers`;

    this.http.get<BrokersInfoView>(url).subscribe({
      next: (data) => {
        this.state.update(({ brokersInfo }) => {
          brokersInfo.set(clusterIdx, data);
          return { brokersInfo };
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
