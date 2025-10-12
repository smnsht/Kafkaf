import { Injectable } from '@angular/core';
import { ConfirmationRequest } from '@app/shared';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private readonly requests = new Subject<ConfirmationRequest>();

  get requests$(): Observable<ConfirmationRequest> {
    return this.requests.asObservable();
  }

  confirm(
    title: string,
    body: string,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  ): Observable<boolean> {
    const response$ = new Subject<boolean>();
    this.requests.next({ title, body, confirmText, cancelText, response$ });
    return response$.asObservable();
  }
}
