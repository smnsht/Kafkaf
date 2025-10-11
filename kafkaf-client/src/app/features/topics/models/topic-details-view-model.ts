import { PartitionInfo } from '@app/features/consumers';

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
