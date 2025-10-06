import { Component, computed, input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModal {
  confirmations = new Subject<boolean>();

  title = input<string>('Title');
  body = input<string | null>(null);
  confirm = input<string>('Confirm');
  cancel = input<string>('Cancel');

  isActive = computed(() => !!this.body());
}
