
export interface BatchItemResult {
  item: string;
  success: boolean;
  error?: string | null;
}

export interface BatchResult {
  results: BatchItemResult[];
  message: string | null;
}

export interface TopicsListViewModel {
  topicName: string;
  partitionsCount: number;
  isInternal: boolean;
  outOfSyncReplicas: number | null;
  replicationFactor: number | null;
}

