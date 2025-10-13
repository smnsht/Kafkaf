import { Component, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { PageWrapper, CreateTopicModel } from '@app/shared';
import { TopicsStore, TopicCustsomParameters, TopicForm } from '@topics/index';
import { uniqueKeysValidator } from '../../base/topic-form-validators';

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
export class TopicsCreate {
  topicForm!: FormGroup;
  topicNames = new Set<string>();

  constructor(
    private readonly fb: FormBuilder,
    public store: TopicsStore,
    route: ActivatedRoute,
  ) {
    const query = route.snapshot.queryParamMap;

    this.topicForm = this.fb.group({
      name: [
        query.get('name'),
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+$/),
          (control: AbstractControl): ValidationErrors | null => {
            if (this.topicNames.has(control.value)) {
              return { custom: { value: `Topic name ${control.value} already exists.` } };
            }
            return null;
          },
        ],
      ],
      numPartitions: [query.get('numPartitions'), Validators.required],
      cleanupPolicy: [query.get('cleanupPolicy'), Validators.required],
      minInSyncReplicas: [query.get('minInSyncReplicas')],
      replicationFactor: [query.get('replicationFactor')],
      timeToRetain: [query.get('timeToRetain')],
      maxMessageBytes: [query.get('maxMessageBytes')],
      retentionBytes: [-1],
      customParameters: this.fb.array([], uniqueKeysValidator())
    });

    route.paramMap.subscribe((params) => {
      const cluster = Number.parseInt(params.get('cluster')!);
      store.selectCluster(cluster);
      store.loadTopicConfigRows();
    });

    effect(() => {
      const topicNames = store.currentItems()?.map((topic) => topic.topicName);
      this.topicNames = new Set<string>(topicNames);
    });
  }

  get customParameters(): FormArray {
    return this.topicForm?.get('customParameters') as FormArray;
  }

  onCreateTopicClick(): void {
    const payload = { ...this.topicForm.value };

    const createRequest: CreateTopicModel = {
      name: payload.name,
      numPartitions: payload.numPartitions,
      cleanupPolicy: payload.cleanupPolicy,
      customParameters: this.customParameters.value,
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
        (<any>createRequest)[key] = numericValue;
      }
    });

    this.store.createTopic(createRequest).subscribe(() => {
      this.topicForm.reset();
      this.customParameters.clear();

      this.store.clearCurrentCluster();
    });
  }
}
