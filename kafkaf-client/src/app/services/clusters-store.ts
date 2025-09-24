import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

export interface ClusterConfig {
  address: string;
  alias: string;
  userName: string;
}

export interface ClusterInfo
{
	alias: string;
	version: string;
	brokerCount: number;
	onlinePartitionCount: number;
	topicCount: number;
	originatingBrokerName?: string;
	originatingBrokerId: number;
	isOffline: boolean;
	error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClustersStore {
  clusterConfigs = signal<ClusterConfig[]>([]);
  clusters = signal<ClusterInfo[]>([]);
  loadingConfigs = signal(false);
  loadingClusters = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    effect(() => {
      if (this.loadingConfigs()) {
        this.fetchClusterConfigs();
      }
    });

    effect(() => {
      if(this.loadingClusters()){
        this.fetchClustersInfo();
      }
    });
  }

  public loadClusterConfigs() {
    this.loadingConfigs.set(true);
    this.error.set(null);
  }

  public loadClustersInfo() {
    this.loadingClusters.set(true);
    this.error.set(null);
  }

  private fetchClusterConfigs(): void {
    const url = `${environment.apiUrl}/clusters/configs`;

    this.http.get<ClusterConfig[]>(url).subscribe({
      next: (configs) => {
        this.clusterConfigs.set(configs);
        this.loadingConfigs.set(false);
      },
      error: (err) => {
        this.loadingConfigs.set(false);
        this.error.set(err);
      },
    });
  }

  private fetchClustersInfo(): void {
    const url = `${environment.apiUrl}/clusters`;

    this.http.get<ClusterInfo[]>(url).subscribe({
      next: (data) => {
        this.clusters.set(data);
        this.loadingClusters.set(false);
      },
      error: (err) => {
        this.loadingClusters.set(false);
        this.error.set(err);
      },
    });
  }
}
