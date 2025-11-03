using Confluent.Kafka;
using Kafkaf.API.Services;

namespace Kafkaf.API.ViewModels;

public record ConsumerGroupPartitionRow(
    string Topic,
    int Partition,
    long? CurrentOffset,
    long? EndOffset,
    long ConsumerLag,
    string? ConsumerId,
    string? Host
);

// <summary>
/// A flattened, UI-friendly representation of a Kafka consumer group,
/// enriched with topic/partition offsets so we can calculate lag and topics.
/// </summary>
public record ConsumerGroupRow(
    string GroupId,
    int NumberOfMembers,
    int NumberOfTopics,
    long ConsumerLag,
    int Coordinator,
    string State,
    List<ConsumerGroupPartitionRow> Partitions
)
{
    /// <summary>
    /// Creates a UI‑friendly row from a consumer group description + offsets,
    /// optionally enriched with watermark offsets so lag can be calculated.
    /// </summary>
    public static ConsumerGroupRow FromConsumerGroupInfo(
        ConsumerGroupInfo info,
        IDictionary<TopicPartition, WatermarkOffsets?>? endOffsets = null
    )
    {
        var description = info.Description;
        var offsets = info.Offsets;

        // Count members directly from description
        var numberOfMembers = description.Members.Count;

        // Topics: union of topics from member assignments and committed offsets
        var topicsFromAssignments = description
            .Members.SelectMany(m =>
                m.Assignment?.TopicPartitions ?? Enumerable.Empty<TopicPartition>()
            )
            .Select(tp => tp.Topic);

        var topicsFromOffsets = offsets.Keys.Select(tp => tp.Topic);

        var numberOfTopics = topicsFromAssignments
            .Concat(topicsFromOffsets)
            .Distinct()
            .Count();

        // Build partition rows
        var partitions = new List<ConsumerGroupPartitionRow>();
        long consumerLag = 0;

        foreach (var kvp in offsets)
        {
            var tp = kvp.Key;
            var committed = kvp.Value;

            long? currentOffset = committed == Offset.Unset ? null : committed.Value;

            long? endOffset = null;
            long lag = 0;

            if (
                endOffsets != null
                && endOffsets.TryGetValue(tp, out var wm)
                && wm != null
            )
            {
                endOffset = wm.High.Value;
                if (currentOffset.HasValue)
                    lag = Math.Max(0, endOffset.Value - currentOffset.Value);
            }

            consumerLag += lag;

            // find member assignment
            string? consumerId = null;
            string? host = null;
            var member = description.Members.FirstOrDefault(m =>
                m.Assignment?.TopicPartitions.Contains(tp) == true
            );
            if (member != null)
            {
                consumerId = member.ConsumerId;
                host = member.Host;
            }

            partitions.Add(
                new ConsumerGroupPartitionRow(
                    tp.Topic,
                    tp.Partition.Value,
                    currentOffset,
                    endOffset,
                    lag,
                    consumerId,
                    host
                )
            );
        }

        return new ConsumerGroupRow(
            GroupId: description.GroupId,
            NumberOfMembers: numberOfMembers,
            NumberOfTopics: numberOfTopics,
            ConsumerLag: consumerLag,
            Coordinator: description.Coordinator.Id,
            State: description.State.ToString(),
            Partitions: partitions
        );
    }
}
