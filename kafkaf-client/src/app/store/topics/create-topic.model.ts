export interface CreateTopicModel {
  name: string;
  numPartitions?: number;
  cleanupPolicy?: string;
  replicationFactor?: number;
  minInSyncReplicas?: number;
  timeToRetain?: number;
  retentionBytes?: number;
  maxMessageBytes?: number;
  customParameters: Array<{ key: string; value: string }>;
}
