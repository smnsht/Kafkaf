import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside';
import { ConfirmationService } from '../../services/confirmation-service';

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

  onCommandClick(event: Event, command: DropdownMenuCommand): void {
    event.preventDefault();

    this.confirmationService
      .confirm(this.confirmationTitle, this.getConfirmationBody(command))
      .subscribe((_) => {
        this.isActive = false;
      });
  }

  onClickedOutside(): void {
    if (this.isActive) {
      this.isActive = false;
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    console.log(event)
  }

  protected getConfirmationBody(_: DropdownMenuCommand): string {
    return '';
  }

  protected get confirmationTitle(): string {
    return 'Confirm the action';
  }
}

@Component({
  selector: 'topics-dropdown-menu',
  imports: [DropdownMenu],
  template: `
    <dropdown-menu>
      <a (click)="onCommandClick($event, 'ClearMessages')" class="dropdown-item has-text-danger"
        >Clear Messages</a
      >
      <i class="dropdown-item is-size-7"
        >Clearing messages is only allowed for topics with DELETE policy</i
      >
      <a (click)="onCommandClick($event, 'RecreateTopic')" class="dropdown-item has-text-danger"
        >Recreate Topic</a
      >
      <a (click)="onCommandClick($event, 'RemoveTopic')" class="dropdown-item has-text-danger"
        >Remove Topic</a
      >
    </dropdown-menu>
  `,
})
export class TopicsDropdownMenu extends DropdownMenu {
  topicName = input<string>();

  constructor() {
    super();

    this.isRight = true;
  }

  protected override getConfirmationBody(command: DropdownMenuCommand): string {
    switch (command) {
      case 'ClearMessages':
        return 'Are you sure want to clear topic messages?';

      case 'RecreateTopic':
        return `Are you sure to recreate <b>${this.topicName() || '?'}</b> topic?`;

      case 'RemoveTopic':
        return `Are you sure want to remove <b>${this.topicName() || '?'}</b> topic?`;

      default:
        return 'Confirm the action';
    }
  }
}
