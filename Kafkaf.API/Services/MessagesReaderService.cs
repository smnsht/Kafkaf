using Confluent.Kafka;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

public class MessagesReaderService
{
    private readonly MessagesReaderServiceOptions _options;
    private readonly MessagesConsumerPool _consumerPool;

    public MessagesReaderService(
        IOptions<MessagesReaderServiceOptions> options,
        MessagesConsumerPool consumerPool
    )
    {
        _options = options.Value;
        _consumerPool = consumerPool;
    }

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromBeginning(
        MessageReaderArgs args
    ) =>
        ReadFromBeginning(
            args.ClusterIdx,
            args.TopicName,
            args.Partitions,
            firstN: args.LimitOrDefault,
            args.Ct
        );

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromBeginning(
        int clusterIdx,
        string topicName,
        int[] partitions,
        int firstN,
        CancellationToken ct
    )
    {
        using var consumer = _consumerPool.GetClient(clusterIdx);

        var topicPartitions = partitions.Select(partition => new TopicPartitionOffset(
            topicName,
            partition,
            Offset.Beginning
        ));

        consumer.Assign(topicPartitions);

        return _consume(consumer, firstN, ct);
    }

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromEnd(MessageReaderArgs args) =>
        ReadFromEnd(
            args.ClusterIdx,
            args.TopicName,
            args.Partitions,
            lastN: args.LimitOrDefault,
            args.Ct
        );

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromEnd(
        int clusterIdx,
        string topicName,
        int[] partitions,
        int lastN,
        CancellationToken ct
    )
    {
        using var consumer = _consumerPool.GetClient(clusterIdx);

        var topicPartitions = partitions.Select(partition =>
        {
            var tp = new TopicPartition(topicName, partition);
            var timeout = TimeSpan.FromSeconds(
                _options.QueryWatermarkOffsetsTimeout
            );
            var watermark = consumer.QueryWatermarkOffsets(tp, timeout);
            long endOffset = watermark.High;

            // Calculate start offset for "last N messages"
            var startOffset = Math.Max(endOffset - lastN, watermark.Low);

            return new TopicPartitionOffset(tp, new Offset(startOffset));
        });

        consumer.Assign(topicPartitions);

        return _consume(consumer, lastN, ct);
    }

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromOffset(MessageReaderArgs args) =>
        ReadFromOffset(
            args.ClusterIdx,
            args.TopicName,
            args.Partitions,
            args.OffsetOrDefault,
            args.Ct
        );

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromOffset(
        int clusterIdx,
        string topicName,
        int[] partitions,
        long? offset,
        CancellationToken ct
    )
    {
        using var consumer = _consumerPool.GetClient(clusterIdx);

        var topicPartitions = partitions.Select(partition => new TopicPartitionOffset(
            topicName,
            partition,
            new Offset(offset ?? 0)
        ));

        consumer.Assign(topicPartitions);

        return _consume(consumer, _options.MaxMessages, ct);
    }

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromTimestamp(
        MessageReaderArgs args
    ) =>
        ReadFromTimestamp(
            args.ClusterIdx,
            args.TopicName,
            args.Partitions,
            args.RequiredTimestamp,
            args.Ct
        );

    public List<ConsumeResult<byte[]?, byte[]?>> ReadFromTimestamp(
        int clusterIdx,
        string topicName,
        int[] partitions,
        DateTime timestamp,
        CancellationToken ct
    )
    {
        using var consumer = _consumerPool.GetClient(clusterIdx);

        // Build TopicPartitionTimestamp list
        var topicPartitionTimestamps = partitions
            .Select(p => new TopicPartitionTimestamp(
                new TopicPartition(topicName, p),
                new Timestamp(timestamp)
            ))
            .ToList();

        // Query broker for offsets corresponding to the timestamp
        var offsetsForTimes = consumer.OffsetsForTimes(
            topicPartitionTimestamps,
            TimeSpan.FromSeconds(_options.OffsetsForTimesTimeout)
        );

        // Assign consumer to those offsets
        consumer.Assign(offsetsForTimes);

        return _consume(consumer, _options.MaxMessages, ct);
    }

    internal List<ConsumeResult<byte[]?, byte[]?>> _consume(
        IConsumer<byte[]?, byte[]?> consumer,
        int maxMessages,
        CancellationToken ct
    )
    {
        var timeout = TimeSpan.FromSeconds(_options.ConsumeTimeout);
        var messages = new List<ConsumeResult<byte[]?, byte[]?>>();
        var eofPartitions = new HashSet<Partition>();
        var assigned = consumer.Assignment.Select(tp => tp.Partition).ToHashSet();

        while (messages.Count < maxMessages && !ct.IsCancellationRequested)
        {
            var cr = consumer.Consume(timeout);

            if (cr is null)
            {
                // No message within timeout → assume we're done
                break;
            }

            if (cr.IsPartitionEOF)
            {
                eofPartitions.Add(cr.Partition);
                if (eofPartitions.SetEquals(assigned))
                    break;
                continue;
            }

            messages.Add(cr);
        }

        return messages;
    }
}
