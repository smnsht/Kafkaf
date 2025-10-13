import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TopicsStore } from '../store/topics/topics';
import { CreateTopicModel } from '@app/shared';
import { inject } from '@angular/core';

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

  buildModel(): CreateTopicModel {
    const payload = { ...this.topicForm.value };

    const model: CreateTopicModel = {
      name: payload.name,
      numPartitions: payload.numPartitions,
      cleanupPolicy: payload.cleanupPolicy,
      customParameters: this.customParameters?.value,
    };

    (
      [
        'minInSyncReplicas',
        'replicationFactor',
        'timeToRetain',
        'maxMessageBytes',
        'retentionBytes',
      ] as TopicFormFieldName[]
    ).forEach((key) => {
      const numericValue = Number.parseInt(payload[key]);
      if (!Number.isNaN(numericValue)) {
        (model as any)[key] = numericValue;
      }
    });

    return model;
  }
}
