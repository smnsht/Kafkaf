import { Component, effect, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { BulmaField } from '@app/shared';
import { TopicConfigRow } from '../../models/topic-config-row';

function usedKeyValidator(setFn: () => Set<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (setFn().has(control.value)) {
      return { custom: { value: `Parameter ${control.value} already used` } };
    }
    return null;
  };
}

export type TopicConfigType = 'number' | 'boolean' | 'text' | 'list';

@Component({
  selector: 'topic-custsom-parameters',
  imports: [ReactiveFormsModule, BulmaField, CommonModule],
  templateUrl: './topic-custsom-parameters.html',
})
export class TopicCustsomParameters {
  private configTypes = new Map<string, string>();
  private usedKeys = signal<Set<string>>(new Set<string>());

  topicForm = input<FormGroup>();
  customParameters = input<FormArray>();
  configs = input<TopicConfigRow[]>();
  loadingConfigRows = input(false);

  constructor(private fb: FormBuilder) {
    effect(() => {
      const configs = this.configs();
      if (configs && configs.length > 0) {
        configs.forEach((cfg) => this.configTypes.set(cfg.key, cfg.type));
      }
    });

    effect(() => {
      const formArray = this.customParameters();
      if (formArray) {
        formArray?.valueChanges.subscribe((arr) => {
          const used = arr.map((row: any) => row.key);
          this.usedKeys.set(new Set<string>(used));
        });
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
      key: ['', [Validators.required, usedKeyValidator(this.usedKeys)]],
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
