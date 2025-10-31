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
}
