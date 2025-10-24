import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'bulma-field',
  imports: [CommonModule],
  templateUrl: './bulma-field.html',
  styleUrl: './bulma-field.scss',
})
export class BulmaField {
  label = input<string>();
  for = input<string>();
  control = input<AbstractControl | null>();
  requiredMessage = input('This field is required');
  maxlengthMessage = input('This field is too long');
  patternMessage = input('Invalid characters');

  isRequired = computed(() => {
    const ctrl = this.control();

    if (ctrl?.validator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = ctrl.validator({} as any);
      return validator?.['required'];
    }

    return false;
  });
}
