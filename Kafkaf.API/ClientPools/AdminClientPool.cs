using Confluent.Kafka;
using Kafkaf.API.Config;

namespace Kafkaf.API.ClientPools;

public class AdminClientPool : AbstractClientPool<IAdminClient>
{
	public AdminClientPool(IReadOnlyList<ClusterConfigOptions> clusterConfigs)
		: base(clusterConfigs) { }

	//private readonly IReadOnlyList<ClusterConfigOptions> _clusterConfigs;
	//private readonly Dictionary<string, IAdminClient> _pool;

	//public AdminClientPool(IReadOnlyList<ClusterConfigOptions> clusterConfigs)
	//{
	//	_clusterConfigs = clusterConfigs;
	//	_pool = new Dictionary<string, IAdminClient>();
	//}

	//public IAdminClient GetClient(string alias)
	//{
	//	var clusterConfig =
	//		_clusterConfigs.FirstOrDefault(c => c.Alias == alias)
	//		?? throw new ArgumentOutOfRangeException(nameof(alias));

	//	return GetClient(clusterConfig);
	//}

	//public IAdminClient GetClient(int clusterNo)
	//{
	//	var clusterConfig =
	//		_clusterConfigs[clusterNo] ?? throw new ArgumentOutOfRangeException(nameof(clusterNo));

	//	return GetClient(clusterConfig);
	//}

	//public IAdminClient GetClient(ClusterConfigOptions clusterConfig)
	//{
	//	var alias = clusterConfig.Alias;

	//	if (_pool.TryGetValue(alias, out var adminClient))
	//		return adminClient;

	//	var config = new AdminClientConfig { BootstrapServers = clusterConfig.Address };

	//	adminClient = new AdminClientBuilder(config).Build();

	//	_pool[alias] = adminClient;

	//	return adminClient;
	//}

	//public void Dispose()
	//{
	//	foreach (var pair in _pool)
	//	{
	//		var client = pair.Value;
	//		client.Dispose();
	//	}

	//	_pool.Clear();
	//}
	protected override IAdminClient BuildClient(ClusterConfigOptions clusterConfig)
	{
		var config = new AdminClientConfig { BootstrapServers = clusterConfig.Address };
		return new AdminClientBuilder(config).Build();
	}
}
