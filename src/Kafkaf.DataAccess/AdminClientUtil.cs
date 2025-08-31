using Confluent.Kafka;

namespace Kafkaf.DataAccess;

public static class AdminClientUtil
{
    public static Task<Metadata> GetMetadata(AdminClientConfig clientConfig, int timeoutInSeconds = 3)
    {
        return Task.Run(() =>
        {
            using var adminClient = new AdminClientBuilder(clientConfig)
                .Build();

            var timespan = TimeSpan.FromSeconds(timeoutInSeconds);

            return adminClient.GetMetadata(timespan);
        });
    }

    public static Task<Metadata> GetMetadata(string bootstrapServers, int timeoutInSeconds = 3)
        => GetMetadata(new AdminClientConfig()
        {
            BootstrapServers = bootstrapServers
        }, timeoutInSeconds);

    public static async Task<Metadata> GetMetadataAsync(AdminClientConfig clientConfig, int timeoutInSeconds = 3) 
        => await Task.Run(() => GetMetadata(clientConfig, timeoutInSeconds));

    public static async Task<Metadata> GetMetadataAsync(string bootstrapServers, int timeoutInSeconds = 3) 
        => await GetMetadataAsync(new AdminClientConfig()
        {
            BootstrapServers = bootstrapServers
        }, timeoutInSeconds);
}
