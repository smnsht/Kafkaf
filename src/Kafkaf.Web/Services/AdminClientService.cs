using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.Web.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web.Services;

public class AdminClientService : IDisposable
{
    private readonly AdminClientConfigOptions _options;

    private ClusterConfigOptions? _clusterConfig;
    private IAdminClient? _adminClient;

    public AdminClientService(IOptions<AdminClientConfigOptions> options)
    {
        _options = options.Value;
    }

    public ClusterConfigOptions? ClusterConfig { get => _clusterConfig; }

    public IAdminClient? AdminClient { get => _adminClient; }

    public AdminClientService SetClusterConfigOptions(ClusterConfigOptions? clusterConfig)
    {
        if (!Equals(clusterConfig, _clusterConfig))
        {            
            Dispose();
        }

        _clusterConfig = clusterConfig;

        if (_clusterConfig != null && _adminClient == null)
        {
            _adminClient = BuildAdminClient();
        }

        return this;
    }

    public Task<Metadata> GetMetadataAsync(CancellationToken cancellationToken = default)
    {
        AssertAdminClient();

        return Task.Run(() =>
        {        
            var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

            return _adminClient!.GetMetadata(timeout);
        }, cancellationToken);
    }

    public Task<Metadata> GetMetadataAsync(string topic, CancellationToken cancellationToken = default)
    {
        AssertAdminClient();

        return Task.Run(() =>
        {            
            var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

            return _adminClient!.GetMetadata(topic, timeout);
        }, cancellationToken);
    }

    public async Task DoWithAdminClientAsync(Func<IAdminClient, Task> action)
    {
        AssertAdminClient();

       await action(_adminClient!);
    }
        
    internal IAdminClient BuildAdminClient()
    {
        if (ClusterConfig is ClusterConfigOptions cco)
        {
            var config = new AdminClientConfig
            {
                BootstrapServers = cco.Address
            };

            var timeout = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

            return new AdminClientBuilder(config).Build();
        }

        throw new InvalidOperationException("Cannot build AdminClient because no cluster configuration was provided.");
    }

    internal void AssertAdminClient()
    {
        if (_adminClient == null)
        {
            throw new InvalidOperationException(
                "Kafka AdminClient has not been initialized. " +
                "Call SetClusterConfigOptions(...) with a valid ClusterConfigOptions instance " +
                "before invoking this operation."
            );
        }        
    }

    public void Dispose()
    {
        if (_adminClient is IAdminClient client)
        {
            client.Dispose();
            _adminClient = null;
        }
    }
}
