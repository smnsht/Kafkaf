namespace Kafkaf.API.Services;

public record MessageReaderArgs(
    int ClusterIdx,
    string TopicName,
    int[] Partitions,
    CancellationToken Ct,
    int? Limit = null,
    long? Offset = null,
    DateTime? Timestamp = null
)
{
    public const int DEFAULT_LIMIT = 25;

    public int LimitOrDefault => Limit ?? DEFAULT_LIMIT;
    public long OffsetOrDefault => Offset ?? 0;
    public DateTime RequiredTimestamp =>
        Timestamp
        ?? throw new InvalidOperationException(
            "Timestamp must be provided when accessing RequiredTimestamp."
        );
}
