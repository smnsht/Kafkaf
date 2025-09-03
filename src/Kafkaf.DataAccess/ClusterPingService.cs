using Confluent.Kafka;

namespace Kafkaf.DataAccess;

using ClusterPingResult = Tuple<Metadata?, Exception?>;

public class ClusterPingService
{
    public long TimeoutInSeconds { get; set; } = 5;

    public ClusterPingResult PingServer(string bootstrapServers)
    {
        var adminConfig = new AdminClientConfig()
        {
            BootstrapServers = bootstrapServers,
        };

        using var adminClient = new AdminClientBuilder(adminConfig)
                .Build();

        var timespan = TimeSpan.FromSeconds(TimeoutInSeconds);

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
