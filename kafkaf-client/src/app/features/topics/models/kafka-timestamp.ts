export enum TimestampType {
  NotAvailable,
  CreateTime,
  LogAppendTime,
}

export interface KafkaTimestamp {
  type: TimestampType;
  unixTimestampMs: number;
  utcDateTime: Date;
}
