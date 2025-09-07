using Confluent.Kafka.Admin;
using Kafkaf.Web.ViewModels;

namespace Kafkaf.Web.Mappers;

public interface ITopicDetailsMapper
{
    TopicDetailsViewModel Map(
        string topicName,
        TopicDescription description,
        DescribeConfigsResult configs,
        Func<int, (long OffsetMin, long OffsetMax)>? offsetProvider = null
    );
}

public class TopicDetailsMapper : ITopicDetailsMapper
{
    private readonly ILogger<TopicDetailsMapper> _logger;

    public TopicDetailsMapper(ILogger<TopicDetailsMapper> logger)
    {
        _logger = logger;
    }

    public TopicDetailsViewModel Map(string topicName,
        TopicDescription desc,
        DescribeConfigsResult configs,
        Func<int, (long OffsetMin, long OffsetMax)>? offsetProvider = null)
    {
        var cleanUpPolicy = configs.Entries
                .FirstOrDefault(e => e.Key == "cleanup.policy")
                .Value.Value ?? string.Empty;

        if (string.IsNullOrEmpty(cleanUpPolicy))
        {
            _logger.LogWarning("No 'cleanup.policy' configuration found for topic '{TopicName}'. Using default value.",
                topicName);
        }

        return new TopicDetailsViewModel()
        {
            Name = desc.Name,
            Internal = desc.IsInternal,
            PartitionCount = desc.Partitions.Count,

            Partitions = desc.Partitions.Select(p =>
            {
                var offsets = offsetProvider?.Invoke(p.Partition) ?? (0, 0);

                return new PartitionInfo()
                {
                    // Partition number
                    Partition = p.Partition,

                    // Leader broker ID (Leader is a Node, so use Id)
                    Leader = p.Leader?.Id ?? -1, // -1 if no leader

                    // Build the list of ReplicaInfo objects for this partition.
                    // Each "replica" here is a broker that holds a copy of the partition's data.
                    Replicas = p.Replicas.Select(node => new ReplicaInfo()
                    {
                        // The broker ID that hosts this replica.
                        Broker = node.Id,

                        // True if this broker is the current leader for the partition.
                        // Only one broker can be leader at a time — it handles all reads/writes.
                        Leader = node.Id == (p.Leader?.Id ?? -1),

                        // True if this broker's replica is fully caught up with the leader.
                        // InSyncReplicas is the broker ID list that Kafka reports as "in sync".
                        InSync = p.ISR.Any(isrNode => isrNode.Id == node.Id)
                    }).ToList(),
                    OffsetMin = offsets.OffsetMin,
                    OffsetMax = offsets.OffsetMax
                };
            }).ToList(),

            // Replication factor: same for all partitions, so take from the first
            ReplicationFactor = desc.Partitions.FirstOrDefault()?.Replicas.Count ?? 0,

            // Total replicas across all partitions
            Replicas = desc.Partitions.Sum(p => p.Replicas.Count),

            // Total in-sync replicas across all partitions
            InSyncReplicas = desc.Partitions.Sum(p => p.ISR.Count),

            // Under-replicated partitions
            UnderReplicatedPartitions = desc.Partitions.Count(
                p => p.ISR.Count < p.Replicas.Count
            ),

            CleanUpPolicy = cleanUpPolicy,

            // These cannot be obtained from TopicMetadata directly:
            // TODO: implement
            BytesInPerSec = null,
            BytesOutPerSec = null,
            SegmentSize = 0,
            SegmentCount = 0,
            KeySerde = null,
            ValueSerde = null
        };
    }
}
