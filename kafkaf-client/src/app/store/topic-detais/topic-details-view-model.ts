import { PartitionInfo } from '@app/models/partition-info';

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
