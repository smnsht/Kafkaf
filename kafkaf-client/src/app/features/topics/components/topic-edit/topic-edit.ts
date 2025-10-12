import { JsonPipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageWrapper } from '@app/shared';
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

  constructor(
    readonly topicDetailsStore: TopicDetailsStore,
    readonly topicsStore: TopicsStore,
    private readonly fb: FormBuilder,
  ) {
    topicDetailsStore.loadTopicDetails();
    topicDetailsStore.loadSettings();
    topicsStore.loadTopicConfigRows();

    effect(() => {
      const topic = topicDetailsStore.details();
      const settings = topicDetailsStore.settings();

      if (topic && settings) {
        console.log(settings);

        this.topicForm = this.fb.group({
          name: [{ value: topic.name, disabled: true }],
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
              }),
          ),
        });
      }
    });
  }
}
