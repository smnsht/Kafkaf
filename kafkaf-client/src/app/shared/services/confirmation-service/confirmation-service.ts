import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmationRequest {
  title: string;
  body: string;
  confirmText?: string;
  cancelText?: string;
  response$: Subject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private requests = new Subject<ConfirmationRequest>();

  get requests$(): Observable<ConfirmationRequest> {
    return this.requests.asObservable();
  }

  confirm(
    title: string,
    body: string,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ): Observable<boolean> {
    const response$ = new Subject<boolean>();
    this.requests.next({ title, body, confirmText, cancelText, response$ });
    return response$.asObservable();
  }
}
