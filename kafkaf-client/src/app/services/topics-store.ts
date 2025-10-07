import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { forkJoin } from 'rxjs';
import { TopicsListViewModel } from '../response.models';
import { BaseStore } from './base-store';

interface TopicsState {
  topicsMap: Map<number, TopicsListViewModel[]>;
  clusterIdx: number;
  loading?: boolean;
  error?: string;
  notice?: string;
}

const initialState: TopicsState = {
  topicsMap: new Map<number, TopicsListViewModel[]>(),
  clusterIdx: NaN,
};

@Injectable({
  providedIn: 'root',
})
export class TopicsStore extends BaseStore<TopicsListViewModel> {
  constructor() {
    super(initialState);
  }

  protected override resourceUrl(clusterIdx: number): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/topics`;
  }

  protected override resourceItemUrl(clusterIdx: number, topicName: string): string {
    return `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}`;
  }

  protected override getItemKey(item: TopicsListViewModel): string | number {
    return item.topicName;
  }

  loadTopics(): boolean {
    return this.loadCollection();
  }

  deleteTopics(topicName: string[]): Promise<void[]> {
    return new Promise<void[]>((resolve, reject) => {
      this.removeItems(topicName, true).subscribe({
        next: (data) => resolve(data),
        error: (err) => {
          this.setPageState({ error: err.message, loading: false });
          reject(err);
        },
      });
    });
  }

  purgeMessages(topicNames: string[]): Promise<void> {
    const clusterIdx = this.clusterIdx();

    const requests = topicNames.map((topic) => {
      const topicUrl = this.resourceItemUrl(clusterIdx, topic);
      return this.http.delete<number>(`${topicUrl}/messages`);
    });

    return new Promise((resolve, reject) => {
      forkJoin(requests).subscribe({
        next: (deletedMessagesCount) => {
          const totalMessages = deletedMessagesCount.reduce((total, count) => {
            return total + count;
          }, 0);

          this.setNotice(
            `${totalMessages} ${totalMessages == 1 ? 'message' : 'messages'} deleted.`
          );
          this.clearCurrentCluster();
          this.loadTopics();

          resolve();
        },
        error: (err) => {
          this.setPageState({ loading: false, error: err.message });
          reject(err);
        },
      });
    });
  }
}
