using Confluent.Kafka;

namespace Kafkaf.API.Services;

public interface IMessagesReaderService
{
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromBeginning(
        int clusterIdx,
        string topicName,
        int[] partitions,
        int firstN,
        CancellationToken ct
    );
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromBeginning(MessageReaderArgs args);
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromEnd(
        int clusterIdx,
        string topicName,
        int[] partitions,
        int lastN,
        CancellationToken ct
    );
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromEnd(MessageReaderArgs args);
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromOffset(
        int clusterIdx,
        string topicName,
        int[] partitions,
        long? offset,
        CancellationToken ct
    );
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromOffset(MessageReaderArgs args);
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromTimestamp(
        int clusterIdx,
        string topicName,
        int[] partitions,
        DateTime timestamp,
        CancellationToken ct
    );
    List<ConsumeResult<byte[]?, byte[]?>> ReadFromTimestamp(MessageReaderArgs args);
    List<ConsumeResult<byte[]?, byte[]?>> ReadUntilOffset(MessageReaderArgs args);
    List<ConsumeResult<byte[]?, byte[]?>> ReadUntilTimestamp(
        int clusterIdx,
        string topicName,
        int[] partitions,
        DateTime timestamp,
        CancellationToken ct
    );
    List<ConsumeResult<byte[]?, byte[]?>> ReadUntilTimestamp(MessageReaderArgs args);
}
