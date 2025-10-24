import { KafkaTimestamp } from '@app/pipes/timestamp/timestamp';

export interface MessageRow {
  offset: number;
  partition: number;
  timestamp: KafkaTimestamp;
  key?: string | null;
  value?: string | null;
  headers?: string | null;
}
