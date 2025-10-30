import { Component, computed, inject, input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { BulmaField } from '@app/components/shared/bulma-field/bulma-field';
import { TopicConfigsStore } from '@app/store/topic-configs/topic-configs-store';

export type TopicConfigType = 'number' | 'boolean' | 'text' | 'list';

@Component({
  selector: 'app-topic-custsom-parameters',
  imports: [ReactiveFormsModule, BulmaField, CommonModule],
  templateUrl: './topic-custsom-parameters.html',
})
export class TopicCustsomParameters implements OnInit {
  private readonly store = inject(TopicConfigsStore);
  private readonly fb = inject(FormBuilder);
  private readonly configTypes = computed<Map<string, string>>(() => {
    const configs = this.store.configs() ?? [];

    return configs.reduce((acc, cfg) => {
      acc.set(cfg.key, cfg.type);
      return acc;
    }, new Map<string, string>());
  });

  readonly configs = computed(() => this.store.configs());
  readonly loadingConfigRows = computed(() => this.store.loading());
  readonly topicForm = input<FormGroup>();
  readonly customParameters = input<FormArray>();

  ngOnInit(): void {
    this.store.loadConfigs();
  }

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

  onSelectChange(index: number): void {
    const group = this.customParameters()?.at(index);
    const input = group?.get('value');

    // reset input on ddl change
    input?.reset();
  }

  configTypeForDDL(ddl: AbstractControl | null): TopicConfigType | undefined {
    const cfgKey = ddl?.value;

    switch (this.configTypes().get(cfgKey)) {
      case 'int':
      case 'long':
      case 'double':
        return 'number';

      case 'boolean':
        return 'boolean';

      case 'string':
        return 'text';

      case 'list':
        return 'list';

      default:
        return undefined;
    }
  }
}
