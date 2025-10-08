import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
export class TopicsCreate {
  topicForm!: FormGroup;

  constructor(private fb: FormBuilder, route: ActivatedRoute) {
    console.log(route.snapshot.queryParamMap);
    const query = route.snapshot.queryParamMap;

    this.topicForm = this.fb.group({
      name: [
        query.get('name'),
        [Validators.required, Validators.maxLength(255), Validators.pattern(/^[a-zA-Z0-9._-]+$/)],
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

  get customParameters(): FormArray {
    return this.topicForm?.get('customParameters') as FormArray;
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
