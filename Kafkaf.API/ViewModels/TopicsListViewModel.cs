using Confluent.Kafka;

namespace Kafkaf.API.ViewModels;

public record TopicsListViewModel(
    string TopicName,
    int PartitionsCount,
    bool IsInternal = false,
    int? OutOfSyncReplicas = null,
    int? ReplicationFactor = null
)
{
    public TopicsListViewModel(TopicMetadata meta)
        : this(TopicName: meta.Topic, PartitionsCount: meta.Partitions.Count)
    {
        // Kafka marks internal topics with a "__" prefix.
        // This heuristic may not be 100% reliable, but TopicMetadata provides no explicit IsInternal flag.
        IsInternal = meta.Topic.StartsWith("__");

        if (meta.Partitions.Count > 0)
        {
            ReplicationFactor = meta.Partitions[0].Replicas.Length;
            OutOfSyncReplicas = meta.Partitions.Sum(partition =>
                partition.Replicas[0] - partition.InSyncReplicas[0]
            );
        }
    }

    public static IEnumerable<TopicsListViewModel> FromMetadata(
        List<TopicMetadata> topics
    ) => topics.Select(topicMeta => new TopicsListViewModel(topicMeta));
}
