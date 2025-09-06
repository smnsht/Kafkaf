using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;

namespace Kafkaf.Web.Services;

public class TopicsService
{
    private readonly ILogger<TopicsService> _logger;
    private readonly AdminClientService _adminService;

    private ClusterConfigOptions? _clusterConfig;

    public TopicsService(ILogger<TopicsService> logger, AdminClientService adminService)
    {
        _logger = logger;
        _adminService = adminService;
    }

    public TopicsService SetClusterConfigOptions(ClusterConfigOptions clusterConfig)
    {
        _clusterConfig = clusterConfig;
        _adminService.SetClusterConfigOptions(clusterConfig);

        return this;
    }

    public async Task DeleteTopicsAsync(string topicName)
        => await DeleteTopicsAsync([topicName]);

    public async Task DeleteTopicsAsync(IEnumerable<string> topicNames)
    {
        var topics = (topicNames ?? Array.Empty<string>())
            .Where(topic => !string.IsNullOrWhiteSpace(topic))
            .ToArray();            

        if (topics.Length == 0)
        {            
            _logger.LogDebug("DeleteTopicsAsync called with no topic names provided. Skipping delete operation.");
            return;
        }

        _logger.LogInformation(
            "Deleting {Count} Kafka topic(s): {Topics}",
            topics.Length,
            string.Join(", ", topics)
        );

        var options = new DeleteTopicsOptions()
        {
            //OperationTimeout = _options.OperationTimeout
            //RequestTimeout = _options.RequestTimeout
        };

        await _adminService.DoWithAdminClientAsync(
            async client => await client.DeleteTopicsAsync(topics, options)
        );        
    }    

    public async Task PurgeMessagesAsync(string topicName)
        => await PurgeMessagesAsync([topicName]);

    public async Task PurgeMessagesAsync(IEnumerable<string> topicNames)
    {
        var topics = (topicNames ?? Array.Empty<string>())
         .Where(topic => !string.IsNullOrWhiteSpace(topic))
         .ToArray();

        if (topics.Length == 0)
        {
            _logger.LogDebug("PurgeMessagesAsync called with no topic names provided. Skipping delete operation.");
            return;
        }

        _logger.LogInformation(
            "Purging {Count} messages from Kafka topic(s): {Topics}",
            topics.Length,
            string.Join(", ", topics)
        );

        var configEntries = new List<ConfigEntry>
        {
            new ConfigEntry()
            {
                Name = "retention.ms",
                Value = "1"
            }
        };

        var configs = topics.Aggregate(new Dictionary<ConfigResource, List<ConfigEntry>>(), (acc, topicName) =>
        {
            var res = new ConfigResource()
            {
                Name = topicName,
                Type = ResourceType.Topic,
            };

            acc.Add(res, configEntries);
            return acc;
        });
        
        await _adminService.DoWithAdminClientAsync(
            async client => await client.AlterConfigsAsync(configs)
        );
    }    
}
