export type tKafkaSection = 'brokers' | 'topics' | 'consumers' | null;
export type MaybeString = string | null | undefined;

export interface ClusterInfo {
  alias: string;
  brokerCount: number;
  totalPartitionCount: number,
  onlinePartitionCount: number;
  underReplicatedPartitionsCount: number;
  totalReplicasCount: number;
  inSyncReplicasCount: number;
  topicCount: number;
  originatingBrokerName?: string;
  originatingBrokerId: number;
  isOffline: boolean;
  error?: string;
}
