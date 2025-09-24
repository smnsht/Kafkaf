using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;

namespace Kafkaf.API.Services;

public class BrokersService
{
	private readonly AdminClientPool _clientPool;

	public BrokersService(AdminClientPool clientPool) => _clientPool = clientPool;

	public async Task<DescribeConfigsResult?> DescribeBrokerAsync(int clusterNo, int brokerId)
	{
		var client = _clientPool.GetClient(clusterNo);

		// Describe configs for broker with ID 0
		var resources = new List<ConfigResource>
		{
			new ConfigResource { Type = ResourceType.Broker, Name = brokerId.ToString() },
		};

		var results = await client.DescribeConfigsAsync(resources);

		return results?.FirstOrDefault();
	}
}
