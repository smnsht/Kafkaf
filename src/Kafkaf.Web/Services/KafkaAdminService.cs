using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web.Services;

public class KafkaAdminService
{
    private readonly AdminClientConfigOptions _options;

    public KafkaAdminService(IOptions<AdminClientConfigOptions> options)
    {
        _options = options.Value;
    }

    public async Task<Metadata?> DeleteTopicsAsync(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames)
    {
        if (topicNames?.Count() > 0)
        {
            using var adminClient = BuildAdminClient(clusterConfig);

            await adminClient.DeleteTopicsAsync(
                topicNames,
                new DeleteTopicsOptions()
                {
                    //OperationTimeout = _options.OperationTimeout
                    //RequestTimeout = _options.RequestTimeout
                });

            return await Task.Run(() =>
            {
                return adminClient.GetMetadata(TimeSpan.FromSeconds(10));
            });            
        }

        return null;
    }

    public async Task PurgeMessagesAsync(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames)
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

            using var adminClient = BuildAdminClient(clusterConfig);

            await adminClient.AlterConfigsAsync(configs);
        }
    }


    public IAdminClient BuildAdminClient(ClusterConfigOptions clusterConfig)
    {
        var config = new AdminClientConfig
        {
            BootstrapServers = clusterConfig.Address
        };

        var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

        return new AdminClientBuilder(config).Build();
    }
}
