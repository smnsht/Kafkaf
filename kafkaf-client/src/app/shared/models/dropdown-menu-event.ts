export type DropdownMenuCommand =
  | 'ClearMessages'
  | 'RecreateTopic'
  | 'RemoveTopic'
  | 'EditSettings';

export interface DropdownMenuEvent {
  command: DropdownMenuCommand;
  confirmed: boolean;
}
