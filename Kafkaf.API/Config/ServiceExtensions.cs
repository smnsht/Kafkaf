using Kafkaf.API.Services;

namespace Kafkaf.API.Config;

public static class ServiceExtensions
{

	public static WebApplicationBuilder ConfigureClusterConfigOptions(this WebApplicationBuilder builder)
	{
		var clusters = builder.Configuration
			.GetSection("Kafkaf:Clusters")
			.Get<List<ClusterConfigOptions>>()
			?? throw new InvalidOperationException(
				$"Missing or invalid configuration for 'Kafkaf:Clusters'. " +
				$"Expected to bind to {typeof(List<ClusterConfigOptions>).FullName}. " +
				"Check your appsettings.json or environment variables."				
			);

		builder.Services.AddSingleton(clusters);

		return builder;
	}

	public static WebApplicationBuilder AddAdminClientConfigOptions(this WebApplicationBuilder builder)
	{
		var sectionName = $"Kafkaf:{nameof(AdminClientPool)}";

		builder.Services
			.AddOptions<AdminClientConfigOptions>()
			.Bind(builder.Configuration.GetSection(sectionName))
			.ValidateDataAnnotations()
			.ValidateOnStart();

		return builder;
	}

	//public static WebApplicationBuilder AddClusterPingServiceOptions(this WebApplicationBuilder builder)
	//{
	//    var sectionName = $"Kafkaf:{nameof(ClusterPingService)}";

	//    builder.Services
	//        .AddOptions<ClusterPingServiceOptions>()
	//        .Bind(builder.Configuration.GetSection(sectionName))
	//        .ValidateDataAnnotations()
	//        .ValidateOnStart();

	//    return builder;
	//}
}
