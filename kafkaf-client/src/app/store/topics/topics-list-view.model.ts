export interface TopicsListViewModel {
  topicName: string;
  partitionsCount: number;
  isInternal: boolean;
  outOfSyncReplicas: number | null;
  replicationFactor: number | null;
}
