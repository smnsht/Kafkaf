export interface ConsumerGroupPartitionRow {
  topic: string;
  partition: number;
  currentOffset?: number;
  endOffset?: number;
  consumerLag: number;
  consumerId?: string;
  host?: string;
}

export interface ConsumerGroupRow {
  groupId: string;
  numberOfMembers: number;
  numberOfTopics: number;
  consumerLag: number;
  coordinator: number;
  state: string;
  partitions: ConsumerGroupPartitionRow[];
}
