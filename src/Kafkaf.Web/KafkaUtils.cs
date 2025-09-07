using System.Collections.Concurrent;
using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;

namespace Kafkaf.Web;

public delegate Task WithClusterConfigAndTopicsAsyncDelegate(ClusterConfigOptions cfg, IEnumerable<string> topics, int timeoutSeconds = 5);

public static class KafkaUtils
{
    public static Task<Metadata> GetMetadata(ClusterConfigOptions clusterConfig, int timeoutSeconds = 5)
    {
        var config = new AdminClientConfig
        {
            BootstrapServers = clusterConfig.Address
        };

        var timeout = TimeSpan.FromSeconds(timeoutSeconds);

        return Task.Run(() =>
        {
            using var adminClient = new AdminClientBuilder(config)
                .Build();

            return adminClient.GetMetadata(timeout);
        });
    }

    public static IEnumerable<Message<string, string>> ReadMessages(ClusterConfigOptions clusterConfig, Metadata meta, string topicName, int timeoutSeconds = 5)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = clusterConfig.Address,
            EnableAutoCommit = false,
            GroupId = Guid.NewGuid().ToString(), // Optional: use random ID to avoid reuse
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        using var consumer = new ConsumerBuilder<string, string>(config).Build();

        // Get metadata to discover partitions        
        var partitions = meta.Topics.First().Partitions.Select(p =>
            new TopicPartitionOffset(topicName, p.PartitionId, Offset.Beginning)).ToList();

        // Assign manually
        consumer.Assign(partitions);

        var results = new List<Message<string, string>>();

        // Read messages
        for (int i = 0; i < 10; i++)
        {
            var cr = consumer.Consume(TimeSpan.FromMilliseconds(100));

            if (cr != null)
            {
                results.Add(cr.Message);
            }
        }

        return results;
    }

    public static async Task PurgeMessages(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames, int timeoutSeconds = 5)
    {
        if (topicNames?.Any() == true)
        {
            var configEntries = new List<ConfigEntry>
            {
                new ConfigEntry()
                {
                    Name = "retention.ms",
                    Value = "1"
                }
            };

            var configs = topicNames.Aggregate(new Dictionary<ConfigResource, List<ConfigEntry>>(), (acc, topicName) =>
            {
                var res = new ConfigResource()
                {
                    Name = topicName,
                    Type = ResourceType.Topic,
                };

                acc.Add(res, configEntries);
                return acc;
            });

            var config = new AdminClientConfig
            {
                BootstrapServers = clusterConfig.Address
            };

            var timeout = TimeSpan.FromSeconds(timeoutSeconds);

            using var adminClient = new AdminClientBuilder(config)
                    .Build();

            await adminClient.AlterConfigsAsync(configs);
        }
    }

    public static async Task DeleteTopics(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames, int timeoutSeconds = 5)
    {
        if (topicNames?.Count() > 0)
        {
            var config = new AdminClientConfig
            {
                BootstrapServers = clusterConfig.Address
            };

            var timeout = TimeSpan.FromSeconds(timeoutSeconds);

            using var adminClient = new AdminClientBuilder(config)
                    .Build();

            await adminClient.DeleteTopicsAsync(
                topicNames,
                new DeleteTopicsOptions()
                {
                    OperationTimeout = timeout,
                    RequestTimeout = timeout
                });
        }
    }

    public static async Task CreateTopicsAsync(ClusterConfigOptions clusterConfig, IEnumerable<TopicSpecification> topics, int timeoutSeconds = 10)
    {
        var config = new AdminClientConfig
        {
            BootstrapServers = clusterConfig.Address
        };

        var timeout = TimeSpan.FromSeconds(timeoutSeconds);

        using var adminClient = new AdminClientBuilder(config)
                .Build();

        await adminClient.CreateTopicsAsync(topics, new CreateTopicsOptions()
        {
            //RequestTimeout = timeout,
            //OperationTimeout = timeout
        });
    }

    public static async Task CreateTopicAsync(ClusterConfigOptions clusterConfig, TopicSpecification topic, int timeoutSeconds = 30) =>
        await CreateTopicsAsync(clusterConfig, new List<TopicSpecification>() { topic }, timeoutSeconds);


    public static long[] CountMessages(ClusterConfigOptions clusterConfig, List<TopicMetadata> topics)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = clusterConfig.Address,
            GroupId = "offset-checker",
            EnableAutoCommit = false
        };

		using var consumer = new ConsumerBuilder<Ignore, Ignore>(config).Build();

		var results = new List<long>();

        foreach (var topic in topics)
        {
            var topicPartitions = topic.Partitions
                .Select(p => new TopicPartition(topic.Topic, p.PartitionId))
                .ToList();

            long total = 0;
            foreach (var tp in topicPartitions)
            {
                var offs = consumer.QueryWatermarkOffsets(tp, TimeSpan.FromSeconds(5));
                total += (offs.High - offs.Low);
            }
            results.Add(total);
        }

        return results.ToArray();
    }
}
