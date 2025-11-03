import { PartitionInfo } from '@app/models/partition-info';

export interface TopicConfigRow {
  key: string;
  type: string;
  defaultValue: string;
}

export interface CreateTopicModel {
  name: string;
  numPartitions?: number;
  cleanupPolicy?: string;
  replicationFactor?: number;
  minInSyncReplicas?: number;
  timeToRetain?: number;
  retentionBytes?: number;
  maxMessageBytes?: number;
  customParameters: { key: string; value: string }[];
}

export interface UpdateTopicModel {
  timeToRetain?: number;
  cleanupPolicy?: string;
  minInSyncReplicas?: number;
  numPartitions?: number;
}

export interface RecreateTopicModel {
  numPartitions: number;
  replicationFactor: number;
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

export interface TopicsListViewModel {
  topicName: string;
  partitionsCount: number;
  isInternal: boolean;
  outOfSyncReplicas: number | null;
  replicationFactor: number | null;
}
