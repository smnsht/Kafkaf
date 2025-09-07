using Confluent.Kafka;
using Kafkaf.Web.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web.Services;

using ClusterPingResult = Tuple<Metadata?, Exception?>;

public class ClusterPingService
{
    private readonly ClusterPingServiceOptions _options;

	public ClusterPingService(IOptions<ClusterPingServiceOptions> options) => _options = options.Value;

	public ClusterPingResult PingServer(string bootstrapServers)
    {
        var adminConfig = new AdminClientConfig()
        {
            BootstrapServers = bootstrapServers,
        };

        using var adminClient = new AdminClientBuilder(adminConfig)
                .Build();

        var timespan = TimeSpan.FromSeconds(_options.TimeoutInSeconds);

        try
        {

            return new(adminClient.GetMetadata(timespan), null);
        }
        catch (Exception ex)
        {
            return new(null, ex);
        }
    }

    public Task<ClusterPingResult> PingServerAsync(string bootstrapServers)
        => Task.Run(() => PingServer(bootstrapServers));
}
