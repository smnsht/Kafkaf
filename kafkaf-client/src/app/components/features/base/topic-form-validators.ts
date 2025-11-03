import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function uniqueTopicNameValidator(topicNames: Set<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (topicNames.has(control.value)) {
      return { custom: { value: `Topic name ${control.value} already exists.` } };
    }
    return null;
  };
}

export function uniqueKeysValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    if (!formArray) return null;

    // Collect all key values
    const keys = formArray.controls.map((g) => (g as FormGroup).get('key')?.value);

    // Find duplicates
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for(const k of keys) {
      if (k && seen.has(k)) {
        duplicates.add(k);
      }
      seen.add(k);
    }

    // For each control, merge/remove the 'duplicate' error
    for(const g of formArray.controls) {
      const ctrl = (g as FormGroup).get('key');
      if (!ctrl) continue;

      const existing = ctrl.errors || {};

      // Remove any old 'duplicate' flag
      if ('duplicate' in existing) {
        delete existing['duplicate'];
      }

      // If this control’s value is a duplicate, add the flag back
      if (duplicates.has(ctrl.value)) {
        ctrl.setErrors({ ...existing, duplicate: true });
      } else {
        // If there are still other errors (like required), keep them
        ctrl.setErrors(Object.keys(existing).length ? existing : null);
      }
    }

    // Return an array-level error if any duplicates exist
    return duplicates.size > 0 ? { duplicateKeys: true } : null;
  };
}
