using Confluent.Kafka;
using Confluent.Kafka.Admin;

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
		var adminClient = _clientPool.GetAdminClient(clusterNo);
		var topics = TopicCollection.OfTopicNames([topicName]);

		return await adminClient.DescribeTopicsAsync(topics);
	}
}
