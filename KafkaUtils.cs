using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Config;

namespace Kafkaf;

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

    public static async Task PurgeMessages(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames, int timeoutSeconds = 5)
    {
        if (topicNames?.Any() == true)
        {
            var configEntries = new List<ConfigEntry>
        {
            new ConfigEntry()
            {
                Name = "retention.ms",
                Value = "1000"
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

    public static Task DeleteTopics(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames, int timeoutSeconds = 5)
    {
        if (topicNames == null || topicNames.Count() == 0)
        {
            return Task.CompletedTask;
        }

        var config = new AdminClientConfig
        {
            BootstrapServers = clusterConfig.Address
        };

        var timeout = TimeSpan.FromSeconds(timeoutSeconds);

        return Task.Run(() =>
        {
            using var adminClient = new AdminClientBuilder(config)
                .Build();

            return adminClient.DeleteTopicsAsync(topicNames, new DeleteTopicsOptions() 
            { 
                OperationTimeout = timeout 
            });
        });
    }
}
