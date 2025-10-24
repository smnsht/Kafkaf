export interface UpdateTopicModel {
  timeToRetain?: number;
  cleanupPolicy?: string;
  minInSyncReplicas?: number;
  numPartitions?: number;
}
