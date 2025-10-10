import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside';
import { ConfirmationService } from '../../services/confirmation-service';
import { LoggerService } from '../../services/logger.service';
import { of } from 'rxjs';

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
  selector: 'dropdown-menu',
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
      : of(true);

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

  protected getConfirmationBody(_: DropdownMenuCommand): string {
    return '';
  }

  protected get confirmationTitle(): string {
    return 'Confirm the action';
  }
}
