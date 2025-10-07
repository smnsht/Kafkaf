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
  templateUrl: './ddl-serde.html'
})
export class DDLSerde {
label = input<string>('Serde');
  options = [...SerdeTypes];
  serde = model<SerdeType>('String');
}
