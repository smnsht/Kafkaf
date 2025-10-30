/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TopicCleanupPolicy = 'delete' | 'compact' | 'compact,delete';
export const DefaultTopicCleanupPolicy: TopicCleanupPolicy = 'delete';

@Component({
  selector: 'ddl-cleanup-policy',
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DdlCleanupPolicy),
      multi: true,
    },
  ],
  template: `
    <div class="select">
      <select [id]="id()" [value]="cleanupPolicy" (change)="onChangeValue($event)">
        @for (option of options; track $index) {
          <option [value]="option[0]">{{ option[1] }}</option>
        }
      </select>
    </div>
  `,
})
export class DdlCleanupPolicy implements ControlValueAccessor {
  readonly id = input('cleanupPolicy');

  readonly options = new Map<TopicCleanupPolicy, string>([
    ['delete', 'Delete'],
    ['compact', 'Compact'],
    ['compact,delete', 'Compact,Delete'],
  ]);

  cleanupPolicy = DefaultTopicCleanupPolicy;

  writeValue(obj: any): void {
    this.cleanupPolicy = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(_isDisabled: boolean): void {
    // optional
  }

  // Callbacks provided by Angular
  private onChange: (value: any) => void = () => {
    // empty
  };

  private onTouched: () => void = () => {
    // empty
  };

  onChangeValue(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.cleanupPolicy = newValue as TopicCleanupPolicy;
    this.onChange(newValue);
    this.onTouched();
  }
}
