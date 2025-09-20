using Confluent.Kafka;
using Kafkaf.API.Config;

namespace Kafkaf.API.Services;

public class AdminClientPool : IDisposable
{
	private readonly List<ClusterConfigOptions> _clusterConfigs;
	private readonly Dictionary<string, IAdminClient> _pool;

	public AdminClientPool(List<ClusterConfigOptions> clusterConfigs)
	{
		_clusterConfigs = clusterConfigs;
		_pool = new Dictionary<string, IAdminClient>();
	}	
	
	public IAdminClient GetAdminClient(string alias)
	{
		var clusterConfig = _clusterConfigs.FirstOrDefault(c => c.Alias == alias)
			?? throw new ArgumentOutOfRangeException(nameof(alias));

		return GetAdminClient(clusterConfig);		
	}

	public IAdminClient GetAdminClient(int clusterNo)
	{
		var clusterConfig = _clusterConfigs[clusterNo]
			?? throw new ArgumentOutOfRangeException(nameof(clusterNo));
		
		return GetAdminClient(clusterConfig);
	}

	public IAdminClient GetAdminClient(ClusterConfigOptions clusterConfig)
	{
		var alias = clusterConfig.Alias;
		
		if (_pool.TryGetValue(alias, out var adminClient))
		{
			return adminClient;
		}

		var config = new AdminClientConfig
		{
			BootstrapServers = clusterConfig.Address,
		};

		adminClient = new AdminClientBuilder(config)
			.Build();

		_pool[alias] = adminClient;

		return adminClient;
	}

	public void Dispose()
	{
		foreach (var pair in _pool)
		{
			var client = pair.Value;
			client.Dispose();
		}

		_pool.Clear();		
	}
}
