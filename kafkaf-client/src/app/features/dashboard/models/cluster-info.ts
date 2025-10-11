export type tKafkaSection = 'brokers' | 'topics' | 'consumers' | null;

export interface ClusterInfo {
  alias: string;
  version: string;
  brokerCount: number;
  onlinePartitionCount: number;
  topicCount: number;
  originatingBrokerName?: string;
  originatingBrokerId: number;
  isOffline: boolean;
  error?: string;
}
