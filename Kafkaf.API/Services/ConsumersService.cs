using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

public interface IConsumersService
{
    Task<List<ConsumerGroupDescription>> GetConsumersAsync(int clusterIdx);
    Task<List<ConsumerGroupDescription>> GetConsumersAsync(int clusterIdx, string topic);
}

public class ConsumersService : IConsumersService
{
    private readonly AdminClientPool _clientPool;
    private readonly AdminClientConfigOptions _options;

    public ConsumersService(
        AdminClientPool clientPool,
        IOptions<AdminClientConfigOptions> options
    )
    {
        _clientPool = clientPool;
        _options = options.Value;
    }

    public async Task<List<ConsumerGroupDescription>> GetConsumersAsync(int clusterIdx)
    {
        var adminClient = _clientPool.GetClient(clusterIdx);
        var groups = await adminClient.ListConsumerGroupsAsync();
        var groupNames = groups.Valid.Select(group => group.GroupId);
        var returnValue = new List<ConsumerGroupDescription>();

        if (groupNames.Any())
        {
            var groupInfo = await adminClient.DescribeConsumerGroupsAsync(groupNames);
            returnValue.AddRange(groupInfo.ConsumerGroupDescriptions);
        }

        return returnValue;
    }

    public async Task<List<ConsumerGroupDescription>> GetConsumersAsync(
        int clusterIdx,
        string topic
    )
    {
        var adminClient = _clientPool.GetClient(clusterIdx);
        var timeout = TimeSpan.FromSeconds(_options.RequestTimeout);
        var groups = await adminClient.ListConsumerGroupsAsync(
            new ListConsumerGroupsOptions() { RequestTimeout = timeout }
        );

        var retval = new List<ConsumerGroupDescription>();

        foreach (var g in groups.Valid)
        {
            var groupInfo = await adminClient.DescribeConsumerGroupsAsync(
                [g.GroupId],
                new DescribeConsumerGroupsOptions() { RequestTimeout = timeout }
            );

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
