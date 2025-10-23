import { Component, effect, input } from '@angular/core';
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
import { TopicConfigRow } from '@app/store/topics/topic-config-row.model';

export type TopicConfigType = 'number' | 'boolean' | 'text' | 'list';

@Component({
  selector: 'topic-custsom-parameters',
  imports: [ReactiveFormsModule, BulmaField, CommonModule],
  templateUrl: './topic-custsom-parameters.html',
})
export class TopicCustsomParameters {
  private readonly configTypes = new Map<string, string>();

  topicForm = input<FormGroup>();
  customParameters = input<FormArray>();
  configs = input<TopicConfigRow[]>();
  loadingConfigRows = input(false);

  constructor(private readonly fb: FormBuilder) {
    effect(() => {
      const configs = this.configs();
      if (configs && configs.length > 0) {
        configs.forEach((cfg) => this.configTypes.set(cfg.key, cfg.type));
      }
    });
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

    switch (this.configTypes.get(cfgKey)) {
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
