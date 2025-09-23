using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Kafkaf.API.ViewModels;

namespace Kafkaf.API.Services;

public class ClusterService
{
	private readonly IReadOnlyList<ClusterConfigOptions> _clusterConfigOptions;
	private readonly AdminClientPool _clientPool;

	public ClusterService(
		IReadOnlyList<ClusterConfigOptions> clusterConfigOptions,
		AdminClientPool clientPool
	)
	{
		_clusterConfigOptions = clusterConfigOptions;
		_clientPool = clientPool;
	}

	public ClusterConfigOptions[] ClusterConfigOptions => _clusterConfigOptions.ToArray();

	public Metadata GetMetadata(int clusterNo)
	{
		var client = _clientPool.GetClient(clusterNo);
		var timeout = TimeSpan.FromSeconds(10);

		return client.GetMetadata(timeout);
	}

	public Metadata GetMetadata(string alias)
	{
		var client = _clientPool.GetClient(alias);
		var timeout = TimeSpan.FromSeconds(10);

		return client.GetMetadata(timeout);
	}

	public Task<ClusterInfoViewModel> FetchClusterInfoAsync(string alias, CancellationToken ct) =>
		Task.Run(
			() =>
			{
				try
				{
					var meta = GetMetadata(alias);
					return ClusterInfoViewModel.FromMetadata(alias, meta);
				}
				catch (Exception e)
				{
					return ClusterInfoViewModel.Offline(alias, e.Message);
				}
			},
			ct
		);

	public async Task<DescribeClusterResult> DescribeClusterAsync(int clusterNo)
	{
		var client = _clientPool.GetClient(clusterNo);

		return await client.DescribeClusterAsync();
	}
}
