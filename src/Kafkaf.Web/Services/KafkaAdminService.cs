using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web.Services;

public class KafkaAdminService
{
    private readonly AdminClientConfigOptions _options;
    private readonly IMemoryCache _memoryCache;

    public KafkaAdminService(IOptions<AdminClientConfigOptions> options, IMemoryCache memoryCache)
    {
        _options = options.Value;
        _memoryCache = memoryCache;
    }

    public async Task DeleteTopicsAsync(ClusterConfigOptions clusterConfig, IEnumerable<string> topicNames)
    {
        if (topicNames?.Count() > 0)
        {
            await DoWithAdminClient(clusterConfig, async adminClient => 
            {
                await adminClient.DeleteTopicsAsync(
                    topicNames,
                    new DeleteTopicsOptions()
                    {
                        //OperationTimeout = _options.OperationTimeout
                        //RequestTimeout = _options.RequestTimeout
                    });
            });

            //using var adminClient = BuildAdminClient(clusterConfig);

            //await adminClient.DeleteTopicsAsync(
            //    topicNames,
            //    new DeleteTopicsOptions()
            //    {
            //        //OperationTimeout = _options.OperationTimeout
            //        //RequestTimeout = _options.RequestTimeout
            //    });

            //var cacheKey = clusterConfig.CacheKey();
            //var meta = adminClient.GetMetadata(TimeSpan.FromMinutes(60)); // TODO

            //_memoryCache.Set(cacheKey, meta, TimeSpan.FromMinutes(60)); // TODO: make configurable
        }
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

            //using var adminClient = BuildAdminClient(clusterConfig);               

            //await adminClient.AlterConfigsAsync(configs);
            await DoWithAdminClient(clusterConfig, async adminClient => await adminClient.AlterConfigsAsync(configs));
        }
    }


    //public IAdminClient BuildAdminClient(ClusterConfigOptions clusterConfig)
    //{
    //    var config = new AdminClientConfig
    //    {
    //        BootstrapServers = clusterConfig.Address
    //    };

    //    var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

    //    return new AdminClientBuilder(config).Build();
    //}

    public async Task DoWithAdminClient(ClusterConfigOptions clusterConfig, Func<IAdminClient, Task> action)
    {
        var cacheKey = clusterConfig.CacheKey();
        
        _memoryCache.Remove(cacheKey);

        var config = new AdminClientConfig
        {
            BootstrapServers = clusterConfig.Address
        };

        var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

        using var adminClient = new AdminClientBuilder(config).Build();

        await action(adminClient);

        var meta = await Task.Run(() => adminClient.GetMetadata(TimeSpan.FromMinutes(60))); // TODO

        _memoryCache.Set(cacheKey, meta, TimeSpan.FromMinutes(60)); // TODO: make configurable
    }
}
