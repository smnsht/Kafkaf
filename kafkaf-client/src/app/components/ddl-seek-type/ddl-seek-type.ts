import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SeekType = 'Offset' | 'Timestamp';

@Component({
  selector: 'ddl-seek-type',
  imports: [FormsModule],
  templateUrl: './ddl-seek-type.html',
  // styleUrl: './ddl-seek-type.scss'
})
export class DdlSeekType {
  options: SeekType[] = ['Offset', 'Timestamp'];
  seekType = model<SeekType>('Timestamp');

  onModelChange(newValue: SeekType): void {
    console.log(newValue);
    this.seekType.set(newValue);
  }
}
