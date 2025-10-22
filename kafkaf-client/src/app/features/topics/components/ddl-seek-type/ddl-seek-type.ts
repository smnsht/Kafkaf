import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@app/shared';

export type SeekType = 'LIMIT' | 'OFFSET' | 'TIMESTAMP';

@Component({
  selector: 'ddl-seek-type',
  imports: [FormsModule],
  template: `
    <div class="field">
      <div class="label">Seek Type</div>
      <div class="control">
        <div class="select is-fullwidth">
          <select [ngModel]="seekType()" (ngModelChange)="onModelChange($event)">
            @for (option of options; track $index) {
              <option [value]="option[0]">{{ option[1] }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class DdlSeekType {
  private readonly logger = inject(LoggerService);

  options = new Map<SeekType, string>([
    ['LIMIT', 'Limit'],
    ['OFFSET', 'Offset'],
    ['TIMESTAMP', 'Timestamp'],
  ]);

  seekType = model<SeekType>('LIMIT');

  onModelChange(newValue: SeekType): void {
    this.logger.debug('[DdlSeekType]: ', newValue);
    this.seekType.set(newValue);
  }
}
