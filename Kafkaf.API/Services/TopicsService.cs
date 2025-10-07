using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.ViewModels;

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

	public async Task<DescribeConfigsResult> DescribeTopicConfigsAsync(
		int clusterIdx,
		string topicName
	)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var topicResource = new ConfigResource() { Name = topicName, Type = ResourceType.Topic };
		var config = await adminClient.DescribeConfigsAsync([topicResource]);
		return config[0];
	}


	public async Task<ConsumerGroupListing[]> GetTopicConsumersAsync(int clusterIdx, string topicName)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var consumerGroups = await adminClient.ListConsumerGroupsAsync();

		return consumerGroups.Valid.ToArray();		
	}

	public async Task CreateTopicsAsync(
		int clusterIdx,
		TopicSpecification topic,
		int timeoutSeconds = 10
	)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);

		await adminClient.CreateTopicsAsync(
			[topic],
			new CreateTopicsOptions()
			{
				//RequestTimeout = timeout,
				//OperationTimeout = timeout
			}
		);
	}

	public async Task<List<BatchItemResult>> DeleteTopicsAsync(
		int clusterIdx,
		IEnumerable<string> topicNames,
		int timeoutSeconds = 5
	)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var timeout = TimeSpan.FromSeconds(timeoutSeconds);

		List<BatchItemResult> retval = new();
		foreach (var topic in topicNames)
		{
			try
			{
				await adminClient.DeleteTopicsAsync(
					[topic],
					new DeleteTopicsOptions()
					{
						OperationTimeout = timeout,
						RequestTimeout = timeout,
					}
				);
				retval.Add(new BatchItemResult(topic, true));
			}
			catch (Exception e)
			{
				_logger.LogDebug(e, "DeleteTopicsAsync(...) failed for topic {0}", topic);

				retval.Add(new BatchItemResult(topic, false, e.Message));
			}
		}

		return retval;
	}

	public async Task DeleteTopicAsync(int clusterIdx, string topic)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var timeout = TimeSpan.FromSeconds(10);

		await adminClient.DeleteTopicsAsync(
			[topic],
			new DeleteTopicsOptions() { OperationTimeout = timeout, RequestTimeout = timeout }
		);
	}
}
