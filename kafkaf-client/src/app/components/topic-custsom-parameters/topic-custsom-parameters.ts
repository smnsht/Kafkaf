import { Component, input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BulmaField } from '../bulma-field/bulma-field';

@Component({
  selector: 'topic-custsom-parameters',
  imports: [ReactiveFormsModule, BulmaField],
  templateUrl: './topic-custsom-parameters.html',
  styleUrl: './topic-custsom-parameters.scss',
})
export class TopicCustsomParameters {
  topicForm = input<FormGroup>();
  customParameters = input<FormArray>();

  constructor(private fb: FormBuilder) {}

  idForSelect(index: number): string {
    return `key${index}`;
  }

  idForInput(index: number): string {
    return `value${index}`;
  }

  removePair(index: number) {
    this.customParameters()?.removeAt(index);
  }

  addCustomParameter(): void {
    const pair = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.customParameters()?.push(pair);
  }
}
