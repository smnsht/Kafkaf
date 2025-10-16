using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;

namespace Kafkaf.API.Services;

public class BrokersService
{
    private readonly AdminClientPool _clientPool;

    public BrokersService(AdminClientPool clientPool) => _clientPool = clientPool;

    public async Task<DescribeConfigsResult> DescribeBrokerAsync(
        int clusterNo,
        int brokerId
    )
    {
        var client = _clientPool.GetClient(clusterNo);

        // Describe configs for broker with ID 0
        var resources = new List<ConfigResource>
        {
            new ConfigResource { Type = ResourceType.Broker, Name = brokerId.ToString() },
        };

        var results = await client.DescribeConfigsAsync(resources);

        if (results[0] is DescribeConfigsResult result)
        {
            return result;
        }

        throw new ArgumentOutOfRangeException(
            nameof(brokerId),
            $"Can't find broker by id '{brokerId}' on cluster '{clusterNo}'."
        );
    }
}
