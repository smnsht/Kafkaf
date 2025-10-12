import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@app/shared';

export type SeekType = 'Offset' | 'Timestamp';

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
              <option [value]="option">{{ option }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class DdlSeekType {
  private readonly logger = inject(LoggerService);

  options: SeekType[] = ['Offset', 'Timestamp'];
  seekType = model<SeekType>('Timestamp');

  onModelChange(newValue: SeekType): void {
    this.logger.debug('[DdlSeekType]: ', newValue);
    this.seekType.set(newValue);
  }
}
