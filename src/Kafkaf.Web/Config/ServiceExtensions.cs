using Kafkaf.Web.Services;

namespace Kafkaf.Web.Config;

public static class ServiceExtensions
{

    public static WebApplicationBuilder ConfigureClusterConfigOptions(this WebApplicationBuilder builder)
    {
        var section = builder.Configuration.GetSection("Kafkaf:Clusters");
        builder.Services.Configure<List<ClusterConfigOptions>>(section);

        return builder;
    }

    public static WebApplicationBuilder AddAdminClientConfigOptions(this WebApplicationBuilder builder)
    {
        var sectionName = $"Kafkaf:{nameof(AdminClientService)}";

        builder.Services
            .AddOptions<AdminClientConfigOptions>()
            .Bind(builder.Configuration.GetSection(sectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        return builder;
    }

    public static WebApplicationBuilder AddClusterPingServiceOptions(this WebApplicationBuilder builder)
    {
        var sectionName = $"Kafkaf:{nameof(ClusterPingService)}";

        builder.Services
            .AddOptions<ClusterPingServiceOptions>()
            .Bind(builder.Configuration.GetSection(sectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        return builder;
    }
}
