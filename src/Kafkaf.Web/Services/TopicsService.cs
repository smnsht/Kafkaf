using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;
using Kafkaf.Web.Mappers;
using Kafkaf.Web.ViewModels;

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

    public async Task<TopicDescription> DescribeTopicAsync(string topicName)
    {
        var result = await _adminService.DoWithAdminClientAsync(async client =>
        {
            //DescribeTopicsOptions options = new DescribeTopicsOptions()
            //{
            //    IncludeAuthorizedOperations = true,
            //    RequestTimeout = TimeSpan.FromSeconds(5)
            //}

            var topics = TopicCollection.OfTopicNames([topicName]);
            return await client.DescribeTopicsAsync(topics);
        });

        if (result?.TopicDescriptions.FirstOrDefault() is TopicDescription td)
        {
            if (td.Error.Code != ErrorCode.NoError)
            {
                throw new KafkaException(td.Error);
            }
            return td;
        }

        throw new InvalidOperationException($"Failed to retrieve description for topic '{topicName}'.");
    }

    public async Task<DescribeConfigsResult> DescribeTopicConfigAsync(string topicName)
    {
        var resource = new ConfigResource
        {
            Type = ResourceType.Topic,
            Name = topicName
        };

        var results = await _adminService.DoWithAdminClientAsync(async client =>
        {
            return await client.DescribeConfigsAsync([resource]);
        });

        if (results?.FirstOrDefault() is DescribeConfigsResult cr)
        {
            return cr;
        }

        throw new InvalidOperationException($"Failed to retrieve configs for topic '{topicName}'.");
    }

    public async Task<TopicDetailsViewModel> GetTopicDetailsAsync(string topicName)
    {
        var desc = await DescribeTopicAsync(topicName);
        var configs = await DescribeTopicConfigAsync(topicName);

        var mapper = new TopicDetailsMapper();        
        var cleanUpPolicy = configs.Entries
                .FirstOrDefault(e => e.Key == "cleanup.policy")
                .Value;

        if (cleanUpPolicy == null)
        {
            _logger.LogWarning("No 'cleanup.policy' configuration found for topic '{TopicName}'. Using default value.",
                topicName);
        }

        return mapper
            .Map(topicName, desc, configs, (int partition) =>
            {
                using var consumer = new ConsumerBuilder<Ignore, Ignore>(new ConsumerConfig
                {
                    BootstrapServers = _clusterConfig!.Address,
                    GroupId = "__offset_query_group",
                    EnableAutoCommit = false
                }).Build();

                var tp = new TopicPartition(topicName, partition);
                var offsets = consumer.QueryWatermarkOffsets(tp, TimeSpan.FromSeconds(5));

                return (offsets.Low, offsets.High);
            });
    }
}
