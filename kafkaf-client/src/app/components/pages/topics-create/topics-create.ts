import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { TopicFormBase } from '@app/components/features/base/topic-form-base';
import {
  uniqueTopicNameValidator,
  uniqueKeysValidator,
} from '@app/components/features/base/topic-form-validators';
import { TopicCustsomParameters } from '@app/components/features/topic-custsom-parameters/topic-custsom-parameters';
import { TopicForm } from '@app/components/features/topic-form/topic-form';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { CreateTopicModel } from '@app/store/topics/create-topic.model';

@Component({
  selector: 'app-topics-create',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TopicCustsomParameters,
    TopicForm,
    PageWrapper,
  ],
  templateUrl: './topics-create.html',
})
export class TopicsCreate extends TopicFormBase {
  constructor() {
    super();

    const query = this.route.snapshot.queryParamMap;
    const topicNames = this.topicsStore.collection()?.map((topic) => topic.topicName);

    this.topicForm = this.fb.group({
      name: [
        query.get('name'),
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+$/),
          uniqueTopicNameValidator(new Set<string>(topicNames)),
        ],
      ],
      numPartitions: [query.get('numPartitions'), Validators.required],
      cleanupPolicy: [query.get('cleanupPolicy') ?? 'delete', Validators.required],
      minInSyncReplicas: [query.get('minInSyncReplicas')],
      replicationFactor: [query.get('replicationFactor')],
      timeToRetain: [query.get('timeToRetain')],
      maxMessageBytes: [query.get('maxMessageBytes')],
      retentionBytes: [-1],
      customParameters: this.fb.array([], uniqueKeysValidator()),
    });
  }

  get customParametersAsFormArray(): FormArray {
    return this.customParameters as FormArray;
  }

  onCreateTopicClick(): void {
    const payload = { ...this.topicForm.value };

    const createRequest: CreateTopicModel = {
      name: payload.name,
      numPartitions: payload.numPartitions,
      cleanupPolicy: payload.cleanupPolicy,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customParameters: this.customParameters?.value.map((pair: { key: string; value: any }) => ({
        ...pair,
        value: String(pair.value),
      })),
    };

    [
      'minInSyncReplicas',
      'replicationFactor',
      'timeToRetain',
      'maxMessageBytes',
      'retentionBytes',
    ].forEach((key) => {
      const numericValue = Number.parseInt(payload[key]);
      if (!Number.isNaN(numericValue)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (createRequest as any)[key] = numericValue;
      }
    });

    this.topicsStore.createTopic(createRequest).subscribe(() => {
      this.topicForm.reset();
      this.topicsStore.reloadTopics();
      this.customParametersAsFormArray?.clear();
    });
  }
}
