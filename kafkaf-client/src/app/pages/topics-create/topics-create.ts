import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { TopicCustsomParameters } from '../../components/topic-custsom-parameters/topic-custsom-parameters';
import { TopicForm } from '../../components/topic-form/topic-form';

@Component({
  selector: 'app-topics-create',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, TopicCustsomParameters, TopicForm],
  templateUrl: './topics-create.html',
  styleUrl: './topics-create.scss',
})
export class TopicsCreate implements OnInit {
  topicForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  get customParameters(): FormArray {
    return this.topicForm?.get('customParameters') as FormArray;
  }

  ngOnInit(): void {
    this.topicForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.maxLength(255), Validators.pattern(/^[a-zA-Z0-9._-]+$/)],
      ],
      numPartitions: [null, Validators.required],
      cleanupPolicy: [null, Validators.required],
      minInSyncReplicas: [null],
      replicationFactor: [null],
      timeToRetain: [null],
      retentionBytes: [null],
      maxMessageBytes: [null],
      customParameters: this.fb.array([]),
    });
  }

  onCreateTopicClick(): void {
    const payload = { ...this.topicForm.value };

    Object.keys(this.topicForm.value).forEach((key) => {
      if (payload[key] === null) {
        delete payload[key];
      }
    });

    console.log(payload);
  }
}
