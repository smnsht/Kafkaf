import { Component, OnInit } from '@angular/core';
import { ConfirmationRequest, ConfirmationService } from '@app/shared';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModal implements OnInit {
  active = false;
  request?: ConfirmationRequest;

  constructor(private readonly confirmationService: ConfirmationService) {}

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
