import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BulmaField } from '@app/components/shared/bulma-field/bulma-field';
import { DdlCleanupPolicy } from '../ddl-cleanup-policy/ddl-cleanup-policy';

@Component({
  selector: 'app-topic-form',
  imports: [ReactiveFormsModule, BulmaField, DdlCleanupPolicy],
  templateUrl: './topic-form.html',
})
export class TopicForm {
  topicForm = input<FormGroup>();

  addTimeToRetain(days: number): void {
    const hours = Math.round(days * 24);
    const timeToRetain = hours * 60 * 60 * 1000;
    this.topicForm()?.get('timeToRetain')?.setValue(timeToRetain);
  }
}
