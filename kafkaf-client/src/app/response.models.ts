export interface ProblemDetails {
  type?: string; // A URI reference that identifies the problem type
  title?: string; // A short, human-readable summary of the problem
  status?: number; // The HTTP status code
  detail?: string; // A human-readable explanation specific to this occurrence
  instance?: string; // A URI reference that identifies the specific occurrence
  [key: string]: any; // Extension members (custom fields from server)
}

export interface BatchItemResult {
  item: string;
  success: boolean;
  error?: string | null;
}

export interface BatchResult {
  results: BatchItemResult[];
  message: string | null;
}

export interface TopicsListViewModel {
  topicName: string;
  partitionsCount: number;
  isInternal: boolean;
  outOfSyncReplicas: number | null;
  replicationFactor: number | null;
}

export interface ReplicaInfo {
  broker: number;
  leader: boolean;
  inSync: boolean;
}

export interface PartitionInfo {
  partition: number;
  leader: number;
  offsetMax: number;
  offsetMin: number;
  messagesCount: number;
  replicas: ReplicaInfo[];
}

export interface TopicDetailsViewModel {
  name: string;
  internal: boolean;
  partitionCount: number;
  replicationFactor: number;
  replicas: number;
  inSyncReplicas: number;
  segmentCount: number;
  underReplicatedPartitions: number;
  messageCount?: number;
  partitions: PartitionInfo[];
}

export interface TopicSettingRow {
  name: string;
  value: string;
  defaultValue?: string | null;
}

export interface TopicConfigRow {
  key: string;
  type: string;
  defaultValue: string;
}

export interface ConsumerGroupRow {
  groupId: string;
  activeConsumers: number;
  consumerLag: number;
  coordinator: number;
  state: string;
}

export interface KafkaTimestamp {
  type: TimestampType;
  unixTimestampMs: number;
  utcDateTime: Date;
}

export interface MessageRow {
  offset: number;
  partition: number;
  timestamp: KafkaTimestamp;
  key?: string | null;
  value?: string | null;
  headers?: string | null;
}

export enum TimestampType {
  NotAvailable,
  CreateTime,
  LogAppendTime,
}
