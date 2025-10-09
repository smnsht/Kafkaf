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
import { BulmaField } from '../bulma-field/bulma-field';
import { TopicConfigRow } from '../../store/topics-store';
import { CommonModule } from '@angular/common';

function usedKeyValidator(setFn: () => Set<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (setFn().has(control.value)) {
      return { custom: { value: `Parameter ${control.value} already used` } };
    }
    return null;
  };
}

@Component({
  selector: 'topic-custsom-parameters',
  imports: [ReactiveFormsModule, BulmaField, CommonModule],
  templateUrl: './topic-custsom-parameters.html',
  styleUrl: './topic-custsom-parameters.scss',
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
    const ddl = group?.get('key');
    const input = group?.get('value');
    const cfgKey = ddl?.value;

    // reset input on ddl change
    input?.reset();

    switch (this.configTypes.get(cfgKey)) {
      case 'int':
      case 'long':
      case 'double':
        (<any>group)['_inputType'] = 'number';
        break;

      case 'boolean':
        (<any>group)['_inputType'] = 'checkbox';
        break;

      case 'string':
      case 'list': // TODO: check
        (<any>group)['_inputType'] = 'text';
        break;
    }
  }
}
