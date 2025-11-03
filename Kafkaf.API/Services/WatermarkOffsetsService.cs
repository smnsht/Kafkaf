using Confluent.Kafka;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

public interface IWatermarkOffsetsService
{
    Dictionary<int, WatermarkOffsets?> GetWatermarkOffsets(
        int clusterNo,
        string topicName,
        int[] partitions
    );

    Dictionary<TopicPartition, WatermarkOffsets?> GetWatermarkOffsets(
        int clusterNo,
        IEnumerable<TopicPartition> partitions
    );
}

public class WatermarkOffsetsService : IWatermarkOffsetsService
{
    private readonly ILogger<WatermarkOffsetsService> _logger;
    private readonly WatermarkOffsetsClientPool _pool;
    private readonly MessageConsumerOptions _options;

    public WatermarkOffsetsService(
        ILogger<WatermarkOffsetsService> logger,
        IOptions<MessageConsumerOptions> options,
        WatermarkOffsetsClientPool pool
    )
    {
        _logger = logger;
        _options = options.Value;
        _pool = pool;
    }

    public Dictionary<int, WatermarkOffsets?> GetWatermarkOffsets(
        int clusterNo,
        string topicName,
        int[] partitions
    )
    {
        var consumer = _pool.GetClient(clusterNo);

        return partitions
            .Select(partition =>
            {
                var tp = new TopicPartition(topicName, partition);
                var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);
                WatermarkOffsets? offsets = null;
                try
                {
                    offsets = consumer.QueryWatermarkOffsets(tp, timeout);
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "QueryWatermarkOffsets failed for cluster/topic {0}/{1}",
                        clusterNo,
                        topicName
                    );
                }
                return new KeyValuePair<int, WatermarkOffsets?>(partition, offsets);
            })
            .ToDictionary(pair => pair.Key, pair => pair.Value);
    }

    public Dictionary<TopicPartition, WatermarkOffsets?> GetWatermarkOffsets(
        int clusterNo,
        IEnumerable<TopicPartition> partitions
    )
    {
        var result = new Dictionary<TopicPartition, WatermarkOffsets?>();

        // 1. Group partitions by topic
        var grouped = partitions
            .GroupBy(tp => tp.Topic)
            .ToDictionary(g => g.Key, g => g.Select(tp => tp.Partition.Value).ToArray());

        // 2. For each topic, invoke the existing method
        foreach (var kvp in grouped)
        {
            var topic = kvp.Key;
            var partitionIds = kvp.Value;

            // existing method returns Dictionary<int, WatermarkOffsets?>
            var topicOffsets = GetWatermarkOffsets(clusterNo, topic, partitionIds);

            // 3. Build result dictionary keyed by TopicPartition
            foreach (var p in partitionIds)
            {
                var tp = new TopicPartition(topic, new Partition(p));

                if (topicOffsets.TryGetValue(p, out var wm))
                    result[tp] = wm;
                else
                    result[tp] = null;
            }
        }

        return result;
    }
}
