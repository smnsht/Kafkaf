import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ClickOutsideDirective } from '@app/shared/directives/click-outside/click-outside';
import { DropdownMenuEvent, DropdownMenuCommand } from '@app/shared/models/dropdown-menu-event';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation';
import { LoggerService } from '@app/shared/services/logger/logger';

import { of } from 'rxjs';

@Component({
  selector: 'dropdown-menu',
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

  handleKeyDown(event: KeyboardEvent) {
    this.logger.debug('[DropdownMenu]: ', event);
  }

  toggleisActive(): void {
    this.isActive = !this.isActive;
  }

  protected getConfirmationBody(_: DropdownMenuCommand): string {
    return '';
  }

  protected get confirmationTitle(): string {
    return 'Confirm the action';
  }
}
