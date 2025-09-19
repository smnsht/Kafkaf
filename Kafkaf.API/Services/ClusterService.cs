using Confluent.Kafka;
using Kafkaf.API.Config;

namespace Kafkaf.API.Services;

public class ClusterService
{
	private readonly List<ClusterConfigOptions> _clusterConfigOptions;
	private readonly AdminClientPool _clientPool;

	public ClusterService(List<ClusterConfigOptions> clusterConfigOptions, AdminClientPool clientPool)
	{
		_clusterConfigOptions = clusterConfigOptions;
		_clientPool = clientPool;
	}

	public ClusterConfigOptions[] ClusterConfigOptions => _clusterConfigOptions.ToArray();

	public async Task<Metadata> GetMetadataAsync(int clusterNo)
	{
		var client = _clientPool.GetAdminClient(clusterNo);
		var timeout = TimeSpan.FromSeconds(10);
		
		return await Task.Run(() => client.GetMetadata(timeout));		
	}

	public async Task<Metadata> GetMetadataAsync(string alias)
	{
		var client = _clientPool.GetAdminClient(alias);
		var timeout = TimeSpan.FromSeconds(10);

		return await Task.Run(() => client.GetMetadata(timeout));
	}
}
