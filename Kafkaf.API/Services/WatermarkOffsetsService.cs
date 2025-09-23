using Confluent.Kafka;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

public class WatermarkOffsetsService
{
	private readonly WatermarkOffsetsClientPool _pool;
	private readonly WatermarkOffsetsClientOptions _options;

	public WatermarkOffsetsService(
		IOptions<WatermarkOffsetsClientOptions> options,
		WatermarkOffsetsClientPool pool
	)
	{
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
				var ts = TimeSpan.FromSeconds(_options.TimeoutInSeconds);
				var offsets = consumer.QueryWatermarkOffsets(tp, ts);
				return new KeyValuePair<int, WatermarkOffsets?>(partition, offsets);
			})
			.ToDictionary(pair => pair.Key, pair => pair.Value);
	}
}
