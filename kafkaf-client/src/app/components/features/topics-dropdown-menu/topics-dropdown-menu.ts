import { Component, input } from '@angular/core';
import {
  DropdownMenu,
  DropdownMenuCommand,
} from '@app/components/shared/dropdown-menu/dropdown-menu';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'topics-dropdown-menu',
  imports: [DropdownMenu],
  templateUrl: './topics-dropdown-menu.html',
})
export class TopicsDropdownMenu extends DropdownMenu {
  topicName = input<string>();
  disabled = input<boolean>(false);
  showEditSettings = input(false);

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
