using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;

namespace Kafkaf.API.Services;

public class ConsumersService
{
	private readonly AdminClientPool _clientPool;

	public ConsumersService(AdminClientPool clientPool) => _clientPool = clientPool;

	public async Task<List<ConsumerGroupDescription>> GetConsumersAsync(int clusterIdx)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var groups = await adminClient.ListConsumerGroupsAsync();
		var groupNames = groups.Valid.Select(group => group.GroupId);
		var groupInfo = await adminClient.DescribeConsumerGroupsAsync(groupNames);

		return groupInfo.ConsumerGroupDescriptions;
	}

	public async Task<List<ConsumerGroupDescription>> GetConsumersAsync(
		int clusterIdx,
		string topic
	)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var groups = await adminClient.ListConsumerGroupsAsync();

		var retval = new List<ConsumerGroupDescription>();

		foreach (var g in groups.Valid)
		{
			var groupInfo = await adminClient.DescribeConsumerGroupsAsync([g.GroupId]);

			var assignedToTopic = groupInfo
				.ConsumerGroupDescriptions.SelectMany(desc => desc.Members)
				.SelectMany(member => member.Assignment.TopicPartitions)
				.Any(tp => tp.Topic == topic);

			if (assignedToTopic)
			{
				retval.AddRange(groupInfo.ConsumerGroupDescriptions);
			}
		}

		return retval;
	}
}
