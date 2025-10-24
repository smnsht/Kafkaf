import { ReplicaInfo } from './replica-info';

export interface PartitionInfo {
  partition: number;
  leader: number;
  offsetMax: number;
  offsetMin: number;
  messagesCount: number;
  replicas: ReplicaInfo[];
}
