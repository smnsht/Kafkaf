import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  RecreateTopicModel,
  TopicsListViewModel,
  CreateTopicModel,
} from '@app/models/topic.models';
import { TopicSettingRow } from '@app/store/topic-settings/topic-settings-store';
import { environment } from 'environments/environment';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpTopicsService {
  private readonly http = inject(HttpClient);

  deleteTopics(clusterIdx: number, topicNames: string[]): Observable<void[]> {
    const requests$ = topicNames.map((topic) => {
      const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topic}`;
      return this.http.delete<void>(url);
    });

    return forkJoin(requests$);
  }

  recreateTopic(clusterIdx: number, topicName: string, req: RecreateTopicModel) {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/recreate`;
    return this.http.post<void>(url, req);
  }

  getTopicQueryParams(
    clusterIdx: number,
    topic: TopicsListViewModel,
  ): Observable<CreateTopicModel> {
    const request$ = this.fetchTopicSettings$(clusterIdx, topic.topicName);

    return request$.pipe(
      map((settings) => {
        const queryParams: CreateTopicModel = {
          name: topic.topicName,
          numPartitions: topic.partitionsCount,
          customParameters: [],
        };

        for (const setting of settings) {
          switch (setting.name) {
            case 'cleanup.policy':
              queryParams.cleanupPolicy = setting.value;
              break;

            case 'min.insync.replicas':
              queryParams.minInSyncReplicas = Number.parseInt(setting.value);
              break;

            case 'retention.ms':
              queryParams.timeToRetain = Number.parseInt(setting.value);
              break;

            case 'max.message.bytes':
              queryParams.maxMessageBytes = Number.parseInt(setting.value);
              break;
          }
        }

        return queryParams;
      }),
    );
  }

  // Topic setting
  fetchTopicSettings$(clusterIdx: number, topicName: string): Observable<TopicSettingRow[]> {
    const url = `${environment.apiUrl}/clusters/${clusterIdx}/topics/${topicName}/settings`;
    return this.http.get<TopicSettingRow[]>(url);
  }

  // Messages
  purgeMessages(clusterIdx: number, topicNames: string[]): Observable<void[]> {
    const baseUrl = `${environment.apiUrl}/clusters/${clusterIdx}/topics`;
    const requests$ = topicNames
      .map((topic) => `${baseUrl}/${topic}/messages`)
      .map((path) => this.http.delete<void>(path));

    return forkJoin(requests$);
  }
}
