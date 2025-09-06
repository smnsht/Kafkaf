using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;
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

    public async Task<TopicDescription?> DescribeTopicAsync(string topicName)
    {
        DescribeTopicsResult? result = null;
        await _adminService.DoWithAdminClientAsync(async client =>
        {
            var topics = TopicCollection.OfTopicNames([topicName]);
            //DescribeTopicsOptions options = new DescribeTopicsOptions()
            //{
            //    IncludeAuthorizedOperations = true,
            //    RequestTimeout = TimeSpan.FromSeconds(5)
            //}
            result = await client.DescribeTopicsAsync(topics);
        });

        return result?.TopicDescriptions.FirstOrDefault();
    }

    public async Task<DescribeConfigsResult?> DescribeTopicConfigAsync(string topicName)
    {
        var resource = new ConfigResource
        {
            Type = ResourceType.Topic,
            Name = topicName
        };

        DescribeConfigsResult? result = null;
        await _adminService.DoWithAdminClientAsync(async client =>
        {
            var results = await client.DescribeConfigsAsync([resource]);
            result = results.FirstOrDefault();
        });

        return result;
    }

    public async Task<TopicDetailsViewModel> GetTopicDetailsAsync(string topicName)
    {    
        var desc = await DescribeTopicAsync(topicName);
        var configs = await DescribeTopicConfigAsync(topicName);

        if (desc == null || configs == null) 
        {
            string missingPart = (desc, configs) switch 
            {
                (null, not null) => "description",
                (not null, null) => "configuration",
                _ => "description and configuration"
            };

            _logger.LogError($"Failed to retrieve {missingPart} for topic '{topicName}'. Cannot continue.");

            throw new ArgumentException($"Topic '{topicName}' is missing required {missingPart}.");
        }

        var cleanUpPolicy = configs.Entries
                .FirstOrDefault(e => e.Key == "cleanup.policy")
                .Value;
        
        if ( cleanUpPolicy == null)
        {
            _logger.LogWarning("No 'cleanup.policy' configuration found for topic '{TopicName}'. Using default value.", topicName);
        }

        using var consumer = new ConsumerBuilder<Ignore, Ignore>(new ConsumerConfig
        {
            BootstrapServers = _clusterConfig!.Address,
            GroupId = "__offset_query_group",
            EnableAutoCommit = false
        }).Build();

        return new TopicDetailsViewModel() 
        {
            Name = desc.Name,
            Internal = desc.IsInternal,
            PartitionCount = desc.Partitions.Count,

            Partitions = desc.Partitions.Select(p => 
            {
                var tp = new TopicPartition(topicName, p.Partition);
                var offsets = consumer.QueryWatermarkOffsets(tp, TimeSpan.FromSeconds(5));

                return new PartitionInfo() 
                {
                    // Partition number
                    Partition = p.Partition,

                    // Leader broker ID (Leader is a Node, so use Id)
                    Leader = p.Leader?.Id ?? -1, // -1 if no leader

                    // Build the list of ReplicaInfo objects for this partition.
                    // Each "replica" here is a broker that holds a copy of the partition's data.
                    Replicas = p.Replicas.Select(node => new ReplicaInfo()
                    {
                        // The broker ID that hosts this replica.
                        Broker = node.Id,

                        // True if this broker is the current leader for the partition.
                        // Only one broker can be leader at a time — it handles all reads/writes.
                        Leader = node.Id == (p.Leader?.Id ?? -1),

                        // True if this broker's replica is fully caught up with the leader.
                        // InSyncReplicas is the broker ID list that Kafka reports as "in sync".
                        InSync = p.ISR.Any(isrNode => isrNode.Id == node.Id)
                    }).ToList(),
                    OffsetMin = offsets.Low,
                    OffsetMax = offsets.High
                };                               
            }).ToList(),

            // Replication factor: same for all partitions, so take from the first
            ReplicationFactor = desc.Partitions.FirstOrDefault()?.Replicas.Count ?? 0,

            // Total replicas across all partitions
            Replicas = desc.Partitions.Sum(p => p.Replicas.Count),

            // Total in-sync replicas across all partitions
            InSyncReplicas = desc.Partitions.Sum(p => p.ISR.Count),

            // Under-replicated partitions
            UnderReplicatedPartitions = desc.Partitions.Count(
                p => p.ISR.Count < p.Replicas.Count
            ),

            CleanUpPolicy = cleanUpPolicy?.Value ?? string.Empty,                

            // These cannot be obtained from TopicMetadata directly:
            // TODO: implement
            BytesInPerSec = null,
            BytesOutPerSec = null,
            SegmentSize = 0,
            SegmentCount = 0,
            KeySerde = null,
            ValueSerde = null            
        };        
    }
}
