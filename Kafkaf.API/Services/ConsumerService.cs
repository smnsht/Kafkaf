using Confluent.Kafka;
using Kafkaf.API.Config;

namespace Kafkaf.API.Services;

public class ConsumerService
{
	private readonly ClusterConfigOptions _clusterConfig;
	private readonly string _GroupId;

	public ConsumerService(
		ClusterConfigOptions clusterConfig,
		string groupId = "__offset_query_group"
	)
	{
		_clusterConfig = clusterConfig;
		_GroupId = groupId;
	}

	public Dictionary<int, WatermarkOffsets?> GetWatermarkOffsets(
		string topicName,
		int[] partitions
	)
	{
		using var consumer = new ConsumerBuilder<Ignore, Ignore>(
			new ConsumerConfig
			{
				BootstrapServers = _clusterConfig.Address,
				GroupId = _GroupId,
				EnableAutoCommit = false,
			}
		).Build();

		return partitions
			.Select(partition =>
			{
				var tp = new TopicPartition(topicName, partition);
				var offsets = consumer.QueryWatermarkOffsets(tp, TimeSpan.FromSeconds(10));
				return new KeyValuePair<int, WatermarkOffsets?>(partition, offsets);
			})
			.ToDictionary(pair => pair.Key, pair => pair.Value);
	}
}
