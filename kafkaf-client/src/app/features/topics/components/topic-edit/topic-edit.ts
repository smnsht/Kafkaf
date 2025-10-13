import { Component, effect, inject } from '@angular/core';
import { BulmaField, PageWrapper } from '@app/shared';

import { TopicFormBase } from '../../base/topic-form-base';
import { TopicDetailsStore } from '../../store/topic-detais/topic-details';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateTopicModel } from '@app/shared/models/update-topic';

@Component({
  selector: 'app-topic-edit',
  imports: [PageWrapper, ReactiveFormsModule, BulmaField],
  templateUrl: './topic-edit.html',
})
export class TopicEdit extends TopicFormBase {
  readonly topicDetailsStore = inject(TopicDetailsStore);

  constructor() {
    super();

    effect(() => {
      const topic = this.topicDetailsStore.details();
      const settings = this.topicDetailsStore.settings();

      if (!topic) {
        this.topicDetailsStore.loadTopicDetails();
      }

      if (!settings) {
        this.topicDetailsStore.loadSettings();
      }

      if (topic && settings) {
        this.topicForm = this.fb.group({
          numPartitions: [
            topic.partitionCount,
            [Validators.required, Validators.min(topic.partitionCount + 1)],
          ],
          timeToRetain: [
            settings.find((s) => s.name == 'retention.ms')?.value,
            Validators.required,
          ],
          cleanupPolicy: [
            settings.find((s) => s.name == 'cleanup.policy')?.value,
            Validators.required,
          ],
          minInSyncReplicas: [
            settings.find((s) => s.name == 'min.insync.replicas')?.value,
            Validators.required,
          ],
        });
      }
    });
  }

  onUpdatePartitionsClick(): void {
    const payload = super.buildModel();

    const updateModel: UpdateTopicModel = {
      numPartitions: payload.numPartitions,
    };

    this.topicDetailsStore.updateTopic(updateModel);
  }

  onUpdateTimeToRetain(): void {
    const payload = super.buildModel();

    const updateModel: UpdateTopicModel = {
      timeToRetain: payload.timeToRetain,
    };

    this.topicDetailsStore.updateTopic(updateModel);
  }

  onUpdateCleanupPolicy(): void {
    const payload = super.buildModel();

    const updateModel: UpdateTopicModel = {
      cleaupPolicy: payload.cleanupPolicy,
    };

    this.topicDetailsStore.updateTopic(updateModel);
  }

  onUpateMinInSyncReplicas(): void {
    const payload = super.buildModel();

    const updateModel: UpdateTopicModel = {
      minInSyncReplicas: payload.minInSyncReplicas,
    };

    this.topicDetailsStore.updateTopic(updateModel);
  }
}
