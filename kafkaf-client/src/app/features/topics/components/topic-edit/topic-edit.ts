import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateTopicModel, PageWrapper } from '@app/shared';
import { TopicDetailsStore } from '../../store/topic-detais/topic-details';
import { TopicsStore } from '../../store/topics/topics';
import { TopicCustsomParameters } from '../topic-custsom-parameters/topic-custsom-parameters';
import { TopicForm } from '../topic-form/topic-form';

const skipSettings = new Set<string>([
  'cleanup.policy',
  'min.insync.replicas',
  'retention.ms',
  'max.message.bytes',
  'retention.bytes',
]);

class TopicFormmmm {
  topicForm!: FormGroup;
  topicNames = new Set<string>();

  protected fb = inject(FormBuilder);

  topicsStore = inject(TopicsStore);
  route = inject(ActivatedRoute);

  protected setFormValues(query: Map<string, any>): void {
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
      retentionBytes: [''],
      customParameters: this.fb.array([]),
    });
  }

  constructor() {
    const query = this.route.snapshot.queryParamMap;

    this.topicForm = this.fb.group({});
    // this.topicForm = this.fb.group({
    //   name: [
    //     query.get('name'),
    //     [
    //       Validators.required,
    //       Validators.maxLength(255),
    //       Validators.pattern(/^[a-zA-Z0-9._-]+$/),
    //       (control: AbstractControl): ValidationErrors | null => {
    //         if (this.topicNames.has(control.value)) {
    //           return { custom: { value: `Topic name ${control.value} already exists.` } };
    //         }
    //         return null;
    //       },
    //     ],
    //   ],
    //   numPartitions: [query.get('numPartitions'), Validators.required],
    //   cleanupPolicy: [query.get('cleanupPolicy'), Validators.required],
    //   minInSyncReplicas: [query.get('minInSyncReplicas')],
    //   replicationFactor: [query.get('replicationFactor')],
    //   timeToRetain: [query.get('timeToRetain')],
    //   maxMessageBytes: [query.get('maxMessageBytes')],
    //   retentionBytes: [''],
    //   customParameters: this.fb.array([]),
    // });

    this.route.paramMap.subscribe((params) => {
      const cluster = parseInt(params.get('cluster')!);
      this.topicsStore.selectCluster(cluster);
      //store.loadTopicConfigRows();
    });

    // effect(() => {
    //   const topicNames = store.currentItems()?.map((topic) => topic.topicName);
    //   this.topicNames = new Set<string>(topicNames);
    // });
  }

  get customParameters(): FormArray {
    return this.topicForm?.get('customParameters') as FormArray;
  }

  buildSaveRequest(): CreateTopicModel {
    const payload = { ...this.topicForm.value };

    const saveRequest: CreateTopicModel = {
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
      const numericValue = parseInt(payload[key]);
      if (!isNaN(numericValue)) {
        (<any>saveRequest)[key] = numericValue;
      }
    });

    console.log(saveRequest);
    return saveRequest;

    // this.store.createTopic(createRequest).subscribe(() => {
    //   this.topicForm.reset();
    //   this.customParameters.clear();

    //   this.store.clearCurrentCluster();
    // });
  }
}

@Component({
  selector: 'app-topic-edit',
  imports: [JsonPipe, PageWrapper, TopicForm, TopicCustsomParameters],
  templateUrl: './topic-edit.html',
})
export class TopicEdit {
  topicForm!: FormGroup;

  get customParameters(): FormArray {
    return this.topicForm?.get('customParameters') as FormArray;
  }

  // configs = computed(() => {
  //   const settings = this.topicDetailsStore.settings();
  //   return settings?.map(setting => {
  //     const configRow: TopicConfigRow = {
  //       key: setting.name,
  //       type: setting.
  //     };
  //   });
  // });

  constructor(readonly topicDetailsStore: TopicDetailsStore, readonly topicsStore: TopicsStore, private readonly fb: FormBuilder) {
    topicDetailsStore.loadTopicDetails();
    topicDetailsStore.loadSettings();
    topicsStore.loadTopicConfigRows();

    effect(() => {
      const topic = topicDetailsStore.details();
      const settings = topicDetailsStore.settings();

      if (topic && settings) {
        console.log(settings);

        this.topicForm = this.fb.group({
          name: [{value: topic.name, disabled: true}],
          numPartitions: [topic.partitionCount, Validators.required],
          replicationFactor: [topic.replicationFactor],
          // fill from settings
          cleanupPolicy: [
            settings.find((s) => s.name == 'cleanup.policy')?.value,
            Validators.required,
          ],
          minInSyncReplicas: [
            settings.find((s) => s.name == 'min.insync.replicas')?.value,
            Validators.required,
          ],
          timeToRetain: [
            settings.find((s) => s.name == 'retention.ms')?.value,
            Validators.required,
          ],
          maxMessageBytes: [
            settings.find((s) => s.name == 'max.message.bytes')?.value,
            Validators.required,
          ],
          retentionBytes: [
            settings.find((s) => s.name == 'retention.bytes')?.value,
            Validators.required,
          ],
          // from settings - except
          customParameters: this.fb.array(
            settings
              .filter((setting) => setting.value != null)
              .filter((setting) => !skipSettings.has(setting.name))
              .map((setting) => {
                const pair = this.fb.group({
                  key: [setting.name, Validators.required],
                  value: [setting.value, Validators.required],
                });
                return pair;
              })
          ),
        });
      }
    });
  }
}
