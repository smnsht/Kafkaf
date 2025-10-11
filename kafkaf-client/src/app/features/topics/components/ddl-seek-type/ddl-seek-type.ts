import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@app/shared';

export type SeekType = 'Offset' | 'Timestamp';

@Component({
  selector: 'ddl-seek-type',
  imports: [FormsModule],
  templateUrl: './ddl-seek-type.html',
})
export class DdlSeekType {
  private logger = inject(LoggerService);

  options: SeekType[] = ['Offset', 'Timestamp'];
  seekType = model<SeekType>('Timestamp');

  onModelChange(newValue: SeekType): void {
    this.logger.debug('[DdlSeekType]: ', newValue);
    this.seekType.set(newValue);
  }
}
