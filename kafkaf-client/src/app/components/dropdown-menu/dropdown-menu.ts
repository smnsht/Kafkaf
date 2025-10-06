import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside';

export type DropdownMenuCommand = 'ClearMessages' | 'RecreateTopic' | 'RemoveTopic';

@Component({
  selector: 'dropdown-menu',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './dropdown-menu.html',
})
export class DropdownMenu {
  isActive = false;
  commandSelected = output<DropdownMenuCommand>();

  onCommandClick(event: Event, command: DropdownMenuCommand): void {
    event.preventDefault();

    const text = this.getConfirmationText(command);

    if (window.confirm(text)) {
      this.commandSelected.emit(command);
    }

    // TODO: Temporary workaround – manually dispatch a synthetic click event
    // to trigger the global "clickOutside" handler and close the menu.
    // This is needed because window.confirm() blocks Angular's change detection,
    // so a direct `this.isActive = false` assignment is not reflected.
    // Replace with proper dialog + direct state update when confirm() is removed.
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  onClickedOutside(): void {
    if (this.isActive) {
      this.isActive = false;
    }
  }

  protected getConfirmationText(_: DropdownMenuCommand): string {
    return '';
  }
}

@Component({
  selector: 'topics-dropdown-menu',
  imports: [DropdownMenu],
  template: `
    <dropdown-menu>
      <a (click)="onCommandClick($event, 'ClearMessages')" class="dropdown-item">Clear Messages</a>
      <a (click)="onCommandClick($event, 'RecreateTopic')" class="dropdown-item">Recreate Topic</a>
      <a (click)="onCommandClick($event, 'RemoveTopic')" class="dropdown-item">Remove Topic</a>
    </dropdown-menu>
  `,
})
export class TopicsDropdownMenu extends DropdownMenu {
  topicName = input<string>();

  protected override getConfirmationText(command: DropdownMenuCommand): string {
    switch (command) {
      case 'ClearMessages':
        return 'Are you sure want to clear topic messages?';

      case 'RecreateTopic':
        return `Are you sure to recreate ${this.topicName() || '?'} topic?`;

      case 'RemoveTopic':
        return `Are you sure want to remove ${this.topicName() || '?'} topic?`;

      default:
        return 'Confirm the action';
    }
  }
}
