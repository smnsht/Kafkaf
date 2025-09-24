using Kafkaf.API.Config;

namespace Kafkaf.API.ClientPools;

public abstract class AbstractClientPool<T> : IDisposable
	where T : IDisposable
{
	protected readonly IReadOnlyList<ClusterConfigOptions> _clusterConfigs;
	protected readonly Dictionary<string, T> _pool;

	public AbstractClientPool(IReadOnlyList<ClusterConfigOptions> clusterConfigs)
	{
		_clusterConfigs = clusterConfigs;
		_pool = new Dictionary<string, T>();
	}

	public T GetClient(ClusterConfigOptions clusterConfig)
	{
		var alias = clusterConfig.Alias;

		if (_pool.TryGetValue(alias, out var adminClient))
			return adminClient;

		var client = BuildClient(clusterConfig);

		_pool[alias] = client;

		return client;
	}

	public T GetClient(string alias)
	{
		var clusterConfig =
			_clusterConfigs.FirstOrDefault(c => c.Alias == alias)
			?? throw new ArgumentOutOfRangeException(nameof(alias));

		return BuildClient(clusterConfig);
	}

	public T GetClient(int clusterNo)
	{
		var clusterConfig =
			_clusterConfigs[clusterNo] ?? throw new ArgumentOutOfRangeException(nameof(clusterNo));

		return BuildClient(clusterConfig);
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

	protected abstract T BuildClient(ClusterConfigOptions clusterConfig);
}
