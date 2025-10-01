export type SortOrderType = 'FORWARD' | 'BACKWARD' | 'TAILING';

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
