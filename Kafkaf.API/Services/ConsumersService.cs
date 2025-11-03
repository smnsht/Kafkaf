using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

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

    /// <summary>
    /// Retrieves all consumer groups for a given Kafka cluster,
    /// along with their committed offsets. Each group's offset
    /// query is executed in parallel for efficiency.
    /// </summary>
    public async Task<List<ConsumerGroupInfo>> GetConsumersAsync(
        int clusterIdx,
        CancellationToken ct
    )
    {
        var adminClient = _clientPool.GetClient(clusterIdx);

        var requestTimeout = TimeSpan.FromMinutes(_options.RequestTimeout);

        // 1. List all groups
        var groups = await adminClient.ListConsumerGroupsAsync(
            new ListConsumerGroupsOptions() { RequestTimeout = requestTimeout }
        );
        var groupNames = groups.Valid.Select(group => group.GroupId).ToList();

        if (!groupNames.Any())
            return new List<ConsumerGroupInfo>();

        // 2. Describe all groups
        var groupInfo = await adminClient.DescribeConsumerGroupsAsync(
            groupNames,
            new DescribeConsumerGroupsOptions() { RequestTimeout = requestTimeout }
        );

        // 3. For each group, start a task to fetch its committed offsets
        var offsetTasks = groupInfo.ConsumerGroupDescriptions.Select(async g =>
        {
            // one ConsumerGroupTopicPartitions per group
            var partitions = new ConsumerGroupTopicPartitions(g.GroupId, null);

            // must call per group
            var result = await adminClient.ListConsumerGroupOffsetsAsync(
                new[] { partitions }, // wrap in a single-element array
                new ListConsumerGroupOffsetsOptions() { RequestTimeout = requestTimeout }
            );

            ct.ThrowIfCancellationRequested();

            // result is a List<ListConsumerGroupOffsetsResult>, but with one element
            var offsetsResult = result[0];

            var offsetsDict = offsetsResult.Partitions.ToDictionary(
                p => p.TopicPartition,
                p => p.Offset
            );

            return new ConsumerGroupInfo(g, offsetsDict);
        });

        // 4. Run them all in parallel
        var consumerGroups = await Task.WhenAll(offsetTasks);

        return consumerGroups.ToList();
    }
}
