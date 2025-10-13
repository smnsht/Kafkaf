export interface UpdateTopicModel
{
	timeToRetain?: number;
	cleaupPolicy?: string;
	minInSyncReplicas?: number;
	numPartitions?: number;
}
