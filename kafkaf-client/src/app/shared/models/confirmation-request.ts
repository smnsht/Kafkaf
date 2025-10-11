import { Subject } from 'rxjs';

export interface ConfirmationRequest {
  title: string;
  body: string;
  confirmText?: string;
  cancelText?: string;
  response$: Subject<boolean>;
}
