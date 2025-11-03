import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ConfirmationService } from '@app/services/confirmation/confirmation';
import { LoggerService } from '@app/services/logger/logger';

import { of } from 'rxjs';
import { ClickOutsideDirective } from '@app/directives/click-outside/click-outside';

export type DropdownMenuCommand =
  | 'ClearMessages'
  | 'RecreateTopic'
  | 'RemoveTopic'
  | 'EditSettings';

export interface DropdownMenuEvent {
  command: DropdownMenuCommand;
  confirmed: boolean;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './dropdown-menu.html',
})
export class DropdownMenu {
  isActive = false;
  isRight = false;

  commandSelected = output<DropdownMenuEvent>();

  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly logger = inject(LoggerService);

  onCommandClick(event: Event, command: DropdownMenuCommand, showConfirmationModal = true): void {
    event.preventDefault();

    const confirmed$ = showConfirmationModal
      ? this.confirmationService.confirm(this.confirmationTitle, this.getConfirmationBody(command))
      : (() => {
          // trigger "click outside" event and close the menu
          const nav = document.getElementsByTagName('nav')[0];
          nav.click();
          return of(true);
        })();

    confirmed$.subscribe((confirmed) => {
      this.commandSelected.emit({ command, confirmed });
      this.isActive = false;
    });
  }

  onClickedOutside(): void {
    if (this.isActive) {
      this.isActive = false;
    }
  }

  toggleIsActive(): void {
    this.isActive = !this.isActive;
  }

  protected getConfirmationBody(_: DropdownMenuCommand): string {
    return '';
  }

  protected get confirmationTitle(): string {
    const text = 'Confirm the action';
    return text;
  }
}
