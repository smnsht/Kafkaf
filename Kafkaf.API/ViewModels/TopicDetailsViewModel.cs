using Confluent.Kafka;
using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record ReplicaInfo(int Broker, bool Leader, bool InSync)
{
    public ReplicaInfo(Node node, TopicPartitionInfo p)
        : this(-1, false, false)
    {
        // The broker ID that hosts this replica.
        Broker = node.Id;

        // True if this broker is the current leader for the partition.
        // Only one broker can be leader at a time — it handles all reads/writes.
        Leader = node.Id == (p.Leader?.Id ?? -1);

        // True if this broker's replica is fully caught up with the leader.
        // InSyncReplicas is the broker ID list that Kafka reports as "in sync".
        InSync = p.ISR.Any(isrNode => isrNode.Id == node.Id);
    }
}

public record PartitionInfo(
    int Partition,
    int Leader,
    long OffsetMax,
    long OffsetMin,
    long MessagesCount,
    ReplicaInfo[] Replicas
)
{
    public PartitionInfo(TopicPartitionInfo p, long offsetMin, long offsetMax)
        : this(
            Partition: p.Partition,
            Leader: p.Leader?.Id ?? -1,
            OffsetMin: offsetMin,
            OffsetMax: offsetMax,
            MessagesCount: offsetMax - offsetMin,
            Replicas: p.Replicas.Select(node => new ReplicaInfo(node, p)).ToArray()
        ) { }
}

public class TopicDetailsViewModel
{
    public string Name { get; set; }
    public bool Internal { get; set; }
    public int PartitionCount { get; set; }
    public int ReplicationFactor { get; set; }
    public int Replicas { get; set; }
    public int InSyncReplicas { get; set; }
    public int SegmentCount { get; set; }
    public int UnderReplicatedPartitions { get; set; }
    public long? MessageCount { get; set; }
    public PartitionInfo[] Partitions { get; set; }

    public static TopicDetailsViewModel build(
        TopicDescription topicDescription,
        Func<int[], Dictionary<int, WatermarkOffsets?>> getWatermarkOffsetsFn
    )
    {
        var partitions = topicDescription.Partitions.Select(p => p.Partition).ToArray();
        var partitionOffsets = getWatermarkOffsetsFn(partitions);
        return new TopicDetailsViewModel(topicDescription, partitionOffsets);
    }

    public TopicDetailsViewModel(
        TopicDescription desc,
        Dictionary<int, WatermarkOffsets?> partitionOffsets
    )
    {
        Name = desc.Name;
        Internal = desc.IsInternal;
        PartitionCount = desc.Partitions.Count;

        // Replication factor: same for all partitions, so take from the first
        ReplicationFactor = desc.Partitions.FirstOrDefault()?.Replicas.Count ?? 0;

        // Total replicas across all partitions
        Replicas = desc.Partitions.Sum(p => p.Replicas.Count);

        // Total in-sync replicas across all partitions
        InSyncReplicas = desc.Partitions.Sum(p => p.ISR.Count);

        // Under-replicated partitions
        UnderReplicatedPartitions = desc.Partitions.Count(p =>
            p.ISR.Count < p.Replicas.Count
        );

        Partitions = desc
            .Partitions.Select(p =>
            {
                var (offsetMin, offsetMax) = (-1L, -1L);

                if (
                    partitionOffsets.TryGetValue(p.Partition, out var offsets)
                    && offsets is WatermarkOffsets offs
                )
                {
                    offsetMin = offs.Low.Value;
                    offsetMax = offs.High.Value;
                }

                return new PartitionInfo(p, offsetMin: offsetMin, offsetMax: offsetMax);
            })
            .ToArray();
    }
}
