import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationRequest, ConfirmationService } from '@app/services/confirmation/confirmation';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModal implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);

  active = false;
  request?: ConfirmationRequest;

  ngOnInit(): void {
    this.confirmationService.requests$.subscribe((req) => {
      this.request = req;
      this.active = true;
    });
  }

  confirm(result: boolean): void {
    this.active = false;
    this.request!.response$.next(result);
    this.request!.response$.complete();
  }
}
