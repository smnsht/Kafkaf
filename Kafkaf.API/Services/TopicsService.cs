using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Infra;
using Kafkaf.API.Models;
using Kafkaf.API.ViewModels;

namespace Kafkaf.API.Services;

public record ClusterTopic(int clusterIdx, string topicName);

public class TopicsService
{
    private readonly ILogger<TopicsService> _logger;
    private readonly AdminClientPool _clientPool;

    public TopicsService(ILogger<TopicsService> logger, AdminClientPool clientPool)
    {
        _logger = logger;
        _clientPool = clientPool;
    }

	public List<TopicMetadata> GetAllTopicsMetadata(int clusterIdx)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var timeout = TimeSpan.FromSeconds(10);
		var meta = adminClient.GetMetadata(timeout);

		return meta.Topics;
	}

	public async Task<TopicDescription> DescribeTopicsAsync(
        int clusterIdx,
        string topicName
    )
    {
        var topics = TopicCollection.OfTopicNames([topicName]);
        var adminClient = _clientPool.GetClient(clusterIdx);

        var result = await adminClient.DescribeTopicsAsync(topics);

        if (!result.TopicDescriptions.Any())
        {
            throw new KafkaTopicNotFoundException(clusterIdx, topicName);
        }

        return result.TopicDescriptions[0];
    }

    public async Task RecreateAsync(
        int clusterIdx,
        string topicName,
        RecreateTopicModel req
    )
    {
        var topicResource = new ConfigResource()
        {
            Name = topicName,
            Type = ResourceType.Topic,
        };

        var adminClient = _clientPool.GetClient(clusterIdx);

        var configs =
            await adminClient.DescribeConfigsAsync([topicResource])
            ?? throw new KafkaTopicNotFoundException(clusterIdx, topicName);

        var timeout = TimeSpan.FromSeconds(10);

        await adminClient.DeleteTopicsAsync(
            [topicName],
            new DeleteTopicsOptions()
            {
                OperationTimeout = timeout,
                RequestTimeout = timeout,
            }
        );

        var specification = new TopicSpecification()
        {
            Name = topicName,
            NumPartitions = req.numPartitions,
            ReplicationFactor = req.replicationFactor,
            Configs = configs[0]
                .Entries.Where(e => e.Value != null && !e.Value.IsDefault)
                .ToDictionary(e => e.Key, e => e.Value.Value),
        };

        await adminClient.CreateTopicsAsync(
            [specification],
            new CreateTopicsOptions()
            {
                RequestTimeout = timeout,
                OperationTimeout = timeout,
            }
        );
    }

    public async Task CreateTopicsAsync(int clusterIdx, TopicSpecification topic)
    {
        var timeout = TimeSpan.FromSeconds(10);
        var adminClient = _clientPool.GetClient(clusterIdx);

        await adminClient.CreateTopicsAsync(
            [topic],
            new CreateTopicsOptions()
            {
                RequestTimeout = timeout,
                OperationTimeout = timeout,
            }
        );
    }

    public async Task UpdateTopicAsync(
        int clusterIdx,
        string topicName,
        UpdateTopicModel model
    )
    {
        var newConfigs = new List<ConfigEntry>();

        if (model.TimeToRetain.HasValue)
        {
            newConfigs.Add(
                new ConfigEntry()
                {
                    Name = "retention.ms",
                    Value = model.TimeToRetain.Value.ToString(),
                }
            );
        }

        if (model.MinInSyncReplicas.HasValue)
        {
            newConfigs.Add(
                new ConfigEntry()
                {
                    Name = "min.insync.replicas",
                    Value = model.MinInSyncReplicas.Value.ToString(),
                }
            );
        }

        if (!string.IsNullOrWhiteSpace(model.CleanupPolicy))
        {
            newConfigs.Add(
                new ConfigEntry() { Name = "cleanup.policy", Value = model.CleanupPolicy }
            );
        }

        var adminClient = _clientPool.GetClient(clusterIdx);

        if (newConfigs.Count > 0)
        {
            // 1. Alter topic configs
            var resource = new ConfigResource
            {
                Type = ResourceType.Topic,
                Name = topicName,
            };

            var configs = new Dictionary<ConfigResource, List<ConfigEntry>>
            {
                { resource, newConfigs },
            };

            await adminClient.AlterConfigsAsync(configs);
        }

        if (model.NumPartitions.HasValue)
        {
            // 2. Increase partitions
            await adminClient.CreatePartitionsAsync(
                new List<PartitionsSpecification>
                {
                    new PartitionsSpecification
                    {
                        Topic = topicName,
                        // must be greater than current partition count
                        IncreaseTo = model.NumPartitions.Value,
                    },
                }
            );
        }
    }

    public async Task<List<BatchItemResult>> DeleteTopicsAsync(
        int clusterIdx,
        IEnumerable<string> topicNames
    )
    {
        var adminClient = _clientPool.GetClient(clusterIdx);
        var timeout = TimeSpan.FromSeconds(10);

        List<BatchItemResult> retval = new();
        foreach (var topic in topicNames)
        {
            try
            {
                await adminClient.DeleteTopicsAsync(
                    [topic],
                    new DeleteTopicsOptions()
                    {
                        OperationTimeout = timeout,
                        RequestTimeout = timeout,
                    }
                );
                retval.Add(new BatchItemResult(topic, true));
            }
            catch (Exception e)
            {
                _logger.LogDebug(e, "DeleteTopicsAsync(...) failed for topic {0}", topic);

                retval.Add(new BatchItemResult(topic, false, e.Message));
            }
        }

        return retval;
    }

    public async Task DeleteTopicAsync(int clusterIdx, string topicName)
    {
        var timeout = TimeSpan.FromSeconds(10);
        var adminClient = _clientPool.GetClient(clusterIdx);

        await adminClient.DeleteTopicsAsync(
            [topicName],
            new DeleteTopicsOptions()
            {
                OperationTimeout = timeout,
                RequestTimeout = timeout,
            }
        );
    }
}
