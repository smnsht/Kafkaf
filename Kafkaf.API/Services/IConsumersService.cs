using Confluent.Kafka;
using Confluent.Kafka.Admin;

namespace Kafkaf.API.Services;

/// <summary>
/// Represents a Kafka consumer group enriched with both its
/// metadata (description) and its committed offsets.
/// </summary>
/// <remarks>
/// This record is designed to provide a unified view of a consumer group:
/// - <see cref="Description"/> contains the group’s state, coordinator,
///   and active members (if any).
/// - <see cref="Offsets"/> contains the committed offsets for each
///   topic/partition the group has consumed from, even if the group
///   currently has no active members.
///
/// By combining these two sources of information, the UI can display
/// both the "live" status of the group and its historical topic associations,
/// similar to what tools like Provectus Kafka UI provide.
/// </remarks>
public record ConsumerGroupInfo(
    /// <summary>
    /// The detailed description of the consumer group, as returned by
    /// <c>DescribeConsumerGroupsAsync</c>. Includes state (Stable, Empty, etc.),
    /// coordinator broker, and membership information.
    /// </summary>
    ConsumerGroupDescription Description,
    /// <summary>
    /// A dictionary mapping each <see cref="TopicPartition"/> to the
    /// last committed <see cref="Offset"/> for this consumer group.
    /// Derived from <c>ListConsumerGroupOffsetsAsync</c>.
    /// </summary>
    Dictionary<TopicPartition, Offset> Offsets
);

public interface IConsumersService
{
    Task<List<ConsumerGroupInfo>> GetConsumersAsync(int clusterIdx, CancellationToken ct);    
}
