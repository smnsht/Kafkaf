import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
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
    if (!ctrl || !ctrl.validator) {
      return false;
    }

    const validator = ctrl.validator({} as any);
    return validator && validator['required'];
  });
}
