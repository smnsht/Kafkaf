using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Kafkaf.API.ViewModels;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

public class ClusterService
{
    private readonly IReadOnlyList<ClusterConfigOptions> _clusterConfigOptions;
    private readonly AdminClientPool _clientPool;
    private readonly TimeSpan _requestTimeout;

    public ClusterService(
        IReadOnlyList<ClusterConfigOptions> clusterConfigOptions,
        AdminClientPool clientPool,
        IOptions<AdminClientConfigOptions> clientConfigOptions
    )
    {
        _clusterConfigOptions = clusterConfigOptions;
        _clientPool = clientPool;

        _requestTimeout = TimeSpan.FromSeconds(clientConfigOptions.Value.RequestTimeout);
    }

    public ClusterConfigOptions[] ClusterConfigOptions() =>
        _clusterConfigOptions.ToArray();

    public Metadata GetMetadata(int clusterNo)
    {
        var client = _clientPool.GetClient(clusterNo);
        return client.GetMetadata(_requestTimeout);
    }

    public Metadata GetMetadata(string alias)
    {
        var client = _clientPool.GetClient(alias);

        return client.GetMetadata(_requestTimeout);
    }

    public Task<ClusterInfoViewModel> FetchClusterInfoAsync(
        string alias,
        CancellationToken ct
    ) =>
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

        return await client.DescribeClusterAsync(
            new DescribeClusterOptions() { RequestTimeout = _requestTimeout }
        );
    }
}
