import { KafkaTimestamp } from "./KafkaTimestamp";


export interface MessageRow {
    offset: number;
    partition: number;
    timestamp: KafkaTimestamp;
    key?: string | null;
    value?: string | null;
    headers?: string | null;
}
