using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Models;

namespace Kafkaf.API.Services;

public class MessagesWriterService
{
    private readonly ProducersPool _producersPool;
    private readonly AdminClientPool _adminClientPool;
    private readonly WatermarkOffsetsService _watermarkOffsetsService;

    public MessagesWriterService(
        ProducersPool pool,
        AdminClientPool adminClientPool,
        WatermarkOffsetsService watermarkOffsetsService
    )
    {
        _producersPool = pool;
        _adminClientPool = adminClientPool;
        _watermarkOffsetsService = watermarkOffsetsService;
    }

    public async Task<DeliveryResult<byte[]?, byte[]?>> CreateMessageAsync(
        int clusterIdx,
        string topicName,
        CreateMessageModel model,
        CancellationToken ct
    )
    {
        var msg = new Message<byte[]?, byte[]?>
        {
            Key = model.KeyBytes,
            Value = model.ValueBytes,
            Headers = model.MessageHeaders,
        };

        var producer = _producersPool.GetClient(clusterIdx);
        var partition = model.Partition.HasValue
            ? new Partition(model.Partition.Value)
            : new Partition();
        var tp = new TopicPartition(topicName, partition);
        return await producer.ProduceAsync(tp, msg, ct);
    }

    /// <summary>
    /// Truncates (deletes) all messages in every partition of the given topic.
    /// Uses Kafka's DeleteRecords API to remove all records up to the current high watermark.
    /// </summary>
    public async Task<List<DeleteRecordsResult>> TruncateMessagesAsync(
        int clusterIdx,
        TopicDescription topicDescription
    )
    {
        // Extract the partition IDs from the topic metadata
        var partitions = topicDescription.Partitions.Select(td => td.Partition).ToArray();

        // Query the current watermark offsets (low/high) for each partition
        var watermarks = _watermarkOffsetsService.GetWatermarkOffsets(
            clusterIdx,
            topicDescription.Name,
            partitions
        );

        // Build a list of TopicPartitionOffset objects that indicate
        // "delete everything up to the current high watermark" for each partition.
        // Only include partitions that actually contain messages (High > Low).
        var tpo = watermarks
            .Where(kv =>
            {
                if (kv.Value is WatermarkOffsets offsets)
                {
                    // Only truncate if there are messages in the partition
                    return offsets.High > offsets.Low;
                }
                return false;
            })
            .Select(kv =>
            {
                // Create a TopicPartition for the given partition ID
                var tp = new TopicPartition(topicDescription.Name, kv.Key);

                // Delete up to the current high watermark (i.e., truncate all messages)
                return new TopicPartitionOffset(tp, kv.Value!.High);
            })
            .ToList();

        // If no partitions had messages, nothing to truncate → return empty result
        if (tpo.Count == 0)
        {
            return new List<DeleteRecordsResult>();
        }

        // Get an AdminClient instance from the pool for the given cluster
        var adminClient = _adminClientPool.GetClient(clusterIdx);

        // Call Kafka's DeleteRecords API to perform the truncation
        // Returns a result per partition
        return await adminClient.DeleteRecordsAsync(tpo);
    }
}
