import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { KafkaTimestamp, TimestampType } from '../../features/topics/models/kafka-timestamp';

export type TimestampDisplayMode = 'type' | 'unix' | 'datetime';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(timestamp: KafkaTimestamp | null | undefined, mode: TimestampDisplayMode): string {
    if (!timestamp) {
      return '';
    }

    switch (mode) {
      case 'type':
        return TimestampType[timestamp.type] ?? 'NotAvailable';

      case 'unix':
        return timestamp.unixTimestampMs.toString();

      case 'datetime':
        return formatDate(timestamp.utcDateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US');

      default:
        // fallback for unexpected mode values
        return 'Unsupported display mode';
    }
  }
}
