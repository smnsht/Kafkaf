using System.ComponentModel.DataAnnotations;
using Confluent.Kafka;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web.Services;

using ClusterPingResult = Tuple<Metadata?, Exception?>;

public class ClusterPingServiceOptions
{
    public const long DefaultTimeoutInSeconds = 5;

    [Range(5, 60, ErrorMessage = "ClusterPingService: TimeoutInSeconds must be between 5 and 60 seconds")]
    public long TimeoutInSeconds { get; set; } = DefaultTimeoutInSeconds;
}


public class ClusterPingService
{
    private readonly ClusterPingServiceOptions _options;

    public ClusterPingService(IOptions<ClusterPingServiceOptions> options)
    {
        _options = options.Value;
    }

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


public static class ClusterPingServiceExtensions
{
    public static IServiceCollection AddKafkafClusterPingService(this IServiceCollection services, IConfiguration configuration)
    {
        var sectionName = $"Kafkaf:{nameof(ClusterPingService)}";

        services
            .AddOptions<ClusterPingServiceOptions>()
            .Bind(configuration.GetSection(sectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();
        
        services.AddTransient<ClusterPingService>();

        return services;
    }
}
