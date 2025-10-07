import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appJsonValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: JsonValidatorDirective,
      multi: true,
    },
  ],
})
export class JsonValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value || value.trim() === '') {
      return null; // empty is valid
    }
    try {
      JSON.parse(value);
      return null; // valid JSON
    } catch {
      return { invalidJson: true };
    }
  }
}
