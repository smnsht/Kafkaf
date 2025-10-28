import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { TopicsStore } from '@app/store/topics/topics-store';

export const TopicFormFieldNames = [
  'name',
  'numPartitions',
  'cleanupPolicy',
  'minInSyncReplicas',
  'replicationFactor',
  'timeToRetain',
  'maxMessageBytes',
  'retentionBytes',
  'customParameters',
] as const;

export type TopicFormFieldName = (typeof TopicFormFieldNames)[number];

export abstract class TopicFormBase {
  topicForm!: FormGroup;

  protected readonly topicsStore = inject(TopicsStore);
  protected readonly fb = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const cluster = Number.parseInt(params.get('cluster')!);
      this.topicsStore.selectCluster(cluster);
      this.topicsStore.loadTopicConfigRows();
    });
  }

  get customParameters() {
    const customParametersField: TopicFormFieldName = 'customParameters';
    return this.topicForm?.get(customParametersField);
  }
}
