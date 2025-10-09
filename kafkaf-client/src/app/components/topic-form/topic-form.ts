import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BulmaField } from '../bulma-field/bulma-field';

@Component({
  selector: 'topic-form',
  imports: [ReactiveFormsModule, BulmaField],
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
