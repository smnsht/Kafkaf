using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Models;
using Kafkaf.API.ViewModels;

namespace Kafkaf.API.Services;

public class SettingsService
{
	private readonly ILogger<SettingsService> _logger;
	private readonly AdminClientPool _clientPool;

	public SettingsService(ILogger<SettingsService> logger, AdminClientPool adminClientPool)
	{
		_logger = logger;
		_clientPool = adminClientPool;
	}

	public Task UpdatePartialAsync(ClusterTopic clusterTopic, PatchSettingModel model) =>
		UpdatePartialAsync(clusterTopic.clusterIdx, clusterTopic.topicName, model);

	public async Task UpdatePartialAsync(
		int clusterIdx,
		string topicName,
		PatchSettingModel model
	)
	{
		var newConfigs = new List<ConfigEntry>
		{
			new ConfigEntry() { Name = model.name, Value = model.value },
		};

		var resource = new ConfigResource { Type = ResourceType.Topic, Name = topicName };

		var configs = new Dictionary<ConfigResource, List<ConfigEntry>>
		{
			{ resource, newConfigs },
		};

		var adminClient = _clientPool.GetClient(clusterIdx);
		await adminClient.AlterConfigsAsync(configs);
	}

	public Task<TopicSettingRow[]> GetAsync(ClusterTopic clusterTopic) =>
		GetAsync(clusterTopic.clusterIdx, clusterTopic.topicName);

	public async Task<TopicSettingRow[]> GetAsync(int clusterIdx, string topicName)
	{
		var adminClient = _clientPool.GetClient(clusterIdx);
		var topicResource = new ConfigResource() { Name = topicName, Type = ResourceType.Topic };
		var config = await adminClient.DescribeConfigsAsync([topicResource]);

		if (config[0] is DescribeConfigsResult topicConfig)
		{
			return TopicSettingRow.FromResult(topicConfig);
		}

		_logger.LogDebug("Settings for cluster/topic {0}/{1} are emtpy", clusterIdx, topicName);

		return [];
	}
}
