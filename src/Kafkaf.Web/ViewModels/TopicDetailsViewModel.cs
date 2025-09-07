namespace Kafkaf.Web.ViewModels;

public class ReplicaInfo
{
	public int Broker { get; set; }
	public bool Leader { get; set; }
	public bool InSync { get; set; }
}

public class PartitionInfo
{
	public int Partition { get; set; }
	public int Leader { get; set; }
	public List<ReplicaInfo> Replicas { get; set; } = new List<ReplicaInfo>();
	public long OffsetMax { get; set; }
	public long OffsetMin { get; set; }
}


public class TopicDetailsViewModel
{
	public required string Name { get; set; }
	public bool Internal { get; set; }
	public List<PartitionInfo> Partitions { get; set; } = new List<PartitionInfo>();
	public int PartitionCount { get; set; }
	public int ReplicationFactor { get; set; }
	public int Replicas { get; set; }
	public int InSyncReplicas { get; set; }
	public double? BytesInPerSec { get; set; }
	public double? BytesOutPerSec { get; set; }
	public long SegmentSize { get; set; }
	public int SegmentCount { get; set; }
	public int UnderReplicatedPartitions { get; set; }
	public required string CleanUpPolicy { get; set; }
	public string? KeySerde { get; set; }
	public string? ValueSerde { get; set; }
}

