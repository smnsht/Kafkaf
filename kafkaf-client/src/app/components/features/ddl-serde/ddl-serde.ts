import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export const SerdeTypes = Object.freeze([
  'String',
  'Int32',
  'Int64',
  'UInt32',
  'UInt64',
  'Avro',
  'Base64',
  'UUIDBinary',
  'ProtobufDecodeRaw',
]);

export type SerdeType = (typeof SerdeTypes)[number];

@Component({
  selector: 'ddl-serde',
  imports: [FormsModule],
  template: `
    <div class="field">
      <div class="label">{{ label() }}</div>
      <div class="control">
        <div class="select is-fullwidth">
          <select [ngModel]="serde()" (ngModelChange)="serde.set($event)">
            @for (serde of options; track $index) {
              <option [value]="serde">{{ serde }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class DDLSerde {
  label = input<string>('Serde');
  options = [...SerdeTypes];
  serde = model<SerdeType>('String');
}
