import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside';
import { ConfirmationService } from '../../services/confirmation-service';
import { LoggerService } from '../../services/logger.service';

export type DropdownMenuCommand = 'ClearMessages' | 'RecreateTopic' | 'RemoveTopic';

@Component({
  selector: 'dropdown-menu',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './dropdown-menu.html',
})
export class DropdownMenu {
  isActive = false;
  isRight = false;

  commandSelected = output<DropdownMenuCommand>();

  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly logger = inject(LoggerService);

  onCommandClick(event: Event, command: DropdownMenuCommand): void {
    event.preventDefault();

    this.confirmationService
      .confirm(this.confirmationTitle, this.getConfirmationBody(command))
      .subscribe((_) => {
        this.commandSelected.emit(command);
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
