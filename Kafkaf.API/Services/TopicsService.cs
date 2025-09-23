using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;

namespace Kafkaf.API.Services;

public class TopicsService
{
	private readonly ILogger<TopicsService> _logger;
	private readonly AdminClientPool _clientPool;

	public TopicsService(ILogger<TopicsService> logger, AdminClientPool clientPool)
	{
		_logger = logger;
		_clientPool = clientPool;
	}

	public async Task<DescribeTopicsResult> DescribeTopicsAsync(int clusterNo, string topicName)
	{
		var adminClient = _clientPool.GetClient(clusterNo);
		var topics = TopicCollection.OfTopicNames([topicName]);

		return await adminClient.DescribeTopicsAsync(topics);
	}
}
