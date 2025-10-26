import { computed, Injectable } from '@angular/core';
import { ClusteredDataCollectionStore2 } from '../clustered-collection-store2';
import { TopicSettingRow } from './topic-setting-row.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { getErrorMessage2 } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class TopicSettingsStore extends ClusteredDataCollectionStore2<TopicSettingRow> {
  readonly topicName = computed(() => this.secondParam());
  readonly settings = computed(() => this.collection());

  constructor() {
    super({}, 'topic');
  }

  protected override fetchCollection(): Observable<TopicSettingRow[]> {
    const topicName = this.secondParam();
    const clusterIdx = this.clusterIdx();

    if (topicName && clusterIdx) {
      return this.loadTopicSettings$(clusterIdx, topicName);
    }

    // raise warnings
    this.getResourceUrl();

    return of([]);
  }

  loadSettings(): void {
    if (!this.hasRecords()) {
      this.loadCollection();
    }
  }

  reloadSettings(): void {
    this.loadCollection();
  }

  loadTopicSettings$(clusterIdx: number, topicName: string): Observable<TopicSettingRow[]> {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/settings`;
    return this.http.get<TopicSettingRow[]>(url);
  }

  private getResourceUrl(): string | undefined {
    const topicName = this.secondParam();

    if (!topicName) {
      this.logger.warn("Can't obtain topicName (second parameter)");
      return undefined;
    }

    const clusterIdx = this.clusterIdx();

    if (Number.isNaN(clusterIdx)) {
      this.logger.warn("Can't obtain clusterIdx");
      return undefined;
    }

    return `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/settings`;
  }

  patchSetting(model: { name: string; value: string }) {
    this.setLoading(true);

    const resourceUrl = this.getResourceUrl();

    return this.http.patch<void>(`${resourceUrl}/${model.name}`, model).pipe(
      tap({
        next: () => {
          this.state.update((state) => ({
            ...state,
            loading: false,
            notice: `Setting ${model.name} updated.`
          }));

          const handle = setTimeout(() => {
            this.setNotice(undefined);
            clearTimeout(handle);
          }, 5000);
        },
        error: (err: HttpErrorResponse) => {
          this.state.update((state) => ({
            ...state,
            loading: false,
            error: getErrorMessage2(err)
          }));

          const handle = setTimeout(() => {
            this.setError(undefined);
            clearTimeout(handle);
          }, 5000);
        },
      }),
    );
  }

}
