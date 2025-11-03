using Confluent.Kafka;

namespace Kafkaf.API.ViewModels;

public class ClusterInfoViewModel
{
    public required string Alias { get; set; }
    public int BrokerCount { get; set; } = -1;
    public int TotalPartitionCount { get; set; } = -1;
    public int OnlinePartitionCount { get; set; } = -1;
    public int UnderReplicatedPartitionsCount { get; set; } = -1;
    public int TotalReplicasCount { get; set; } = -1;
    public int InSyncReplicasCount { get; set; } = -1;
    public int TopicCount { get; set; } = -1;
    public string? OriginatingBrokerName { get; set; }
    public int OriginatingBrokerId { get; set; } = -1;
    public bool IsOffline { get; set; }
    public string? Error { get; set; }

    public static ClusterInfoViewModel FromMetadata(string alias, Metadata meta)
    {
        ArgumentNullException.ThrowIfNull(meta);

        return new ClusterInfoViewModel()
        {
            Alias = alias,
            BrokerCount = meta.Brokers.Count,
            TotalPartitionCount = meta.Topics.Sum(t => t.Partitions.Count),
            OnlinePartitionCount = meta
                .Topics.Where(t => !t.Error.IsError)
                .Sum(t => t.Partitions.Count),
            // A partition is considered under‑replicated if not all of its replicas are currently in the In‑Sync Replica (ISR) set.
            UnderReplicatedPartitionsCount = meta.Topics.Sum(t =>
                t.Partitions.Count(p => p.Replicas.Length > p.InSyncReplicas.Length)
            ),
            TotalReplicasCount = meta.Topics.Sum(t =>
                t.Partitions.Sum(p => p.Replicas.Length)
            ),
            InSyncReplicasCount = meta.Topics.Sum(t =>
                t.Partitions.Sum(p => p.InSyncReplicas.Length)
            ),
            TopicCount = meta.Topics.Count,
            OriginatingBrokerName = meta.OriginatingBrokerName,
            OriginatingBrokerId = meta.OriginatingBrokerId,
            IsOffline = false,
        };
    }

    public static ClusterInfoViewModel Offline(string alias, string error) =>
        new ClusterInfoViewModel()
        {
            Alias = alias,
            IsOffline = true,
            Error = error,
        };
}
