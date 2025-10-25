import { computed, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ClusterInfo } from './cluster-info.model';
import { BaseCollectionStore } from '../base-collection-store';

@Injectable({
  providedIn: 'root',
})
export class ClustersStore2 extends BaseCollectionStore<ClusterInfo> {
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
