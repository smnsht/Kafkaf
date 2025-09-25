import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface BrokerInfoRow{
  brokerID: number;
  port: number;
  host: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrokersStore {
  brokers = signal<BrokerInfoRow[]>([]);
  loadingBrokers = signal<boolean>(false);
  loadingBrokersError = signal<string | null>(null);

  constructor(private readonly http: HttpClient){
    effect(() => {
      if (this.loadingBrokers()) {

      }
    });
  }

  private fetchBrokers(clusterIdx: number): void {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/brokers`;
  }
}
