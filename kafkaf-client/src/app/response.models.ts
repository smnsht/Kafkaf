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
