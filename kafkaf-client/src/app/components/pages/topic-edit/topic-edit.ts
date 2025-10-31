import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TopicFormBase } from '@app/components/features/base/topic-form-base';
import { BulmaField } from '@app/components/shared/bulma-field/bulma-field';
import { PageWrapper } from '@app/components/shared/page-wrapper/page-wrapper';
import { UpdateTopicModel } from '@app/store/topic-detais/update-topic.model';
import { TopicOverviewStore } from '@app/store/topic-overview/topic-overview-store';
import { TopicSettingsStore } from '@app/store/topic-settings/topic-settings-store';
import { DdlCleanupPolicy } from "@app/components/features/ddl-cleanup-policy/ddl-cleanup-policy";

@Component({
  selector: 'app-topic-edit',
  imports: [PageWrapper, ReactiveFormsModule, BulmaField, DdlCleanupPolicy],
  templateUrl: './topic-edit.html',
})
export class TopicEdit extends TopicFormBase {
  readonly topicOverviewStore = inject(TopicOverviewStore);
  readonly topicSettingsStore = inject(TopicSettingsStore);

  constructor() {
    super();

    this.topicOverviewStore.loadTopicDetails();
    this.topicSettingsStore.loadSettings();

    effect(() => {
      const topic = this.topicOverviewStore.topicDetails();
      const settings = this.topicSettingsStore.settings();

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
    this.update('numPartitions');
  }

  onUpdateTimeToRetain(): void {
    this.update('timeToRetain');
  }

  onUpdateCleanupPolicy(): void {
    this.update('cleanupPolicy');
  }

  onUpateMinInSyncReplicas(): void {
    this.update('minInSyncReplicas');
  }

  private update(key: keyof UpdateTopicModel): void {
    const updateModel: UpdateTopicModel = {
      [key]: this.topicForm.get(key)?.value,
    };

    console.log(updateModel);
    //this.topicDetailsStore.updateTopic(updateModel);
  }
}
