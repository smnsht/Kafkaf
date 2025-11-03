import { computed, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { BaseCollectionStore } from '../base-collection-store';

export type tKafkaSection = 'brokers' | 'topics' | 'consumers' | null;
export type MaybeString = string | null | undefined;

export interface ClusterInfo {
  alias: string;
  brokerCount: number;
  totalPartitionCount: number;
  onlinePartitionCount: number;
  underReplicatedPartitionsCount: number;
  totalReplicasCount: number;
  inSyncReplicasCount: number;
  topicCount: number;
  originatingBrokerName?: string;
  originatingBrokerId: number;
  isOffline: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClustersStore extends BaseCollectionStore<ClusterInfo> {
  constructor() {
    super({});
  }

  public clusters = computed(() => this.collection());

  protected override fetchCollection(): Observable<ClusterInfo[]> {
    const url = `${environment.apiUrl}/clusters`;
    return this.http.get<ClusterInfo[]>(url);
  }

  loadClusters(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }
}
