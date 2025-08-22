using Confluent.Kafka;
using Kafkaf.Config;

namespace Kafkaf;

public static class KafkaUtils
{    
    public static Task<Metadata> GetMetadata(ClusterConfigOptions clusterConfig, int timeoutSeconds = 5)
    {
        var config = new AdminClientConfig
        {
            BootstrapServers = clusterConfig.Address
        };

        var timeout = TimeSpan.FromSeconds(timeoutSeconds);

        return Task.Run(() =>
        {
            using var adminClient = new AdminClientBuilder(config)
                .Build();

            return adminClient.GetMetadata(timeout);          
        });        
    }

}
