using System.Text;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Config;
using Kafkaf.API.Infra;
using Kafkaf.API.Routing;
using Kafkaf.API.Services;

namespace Kafkaf.API
{
	public static class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			builder
				.ConfigureClusterConfigOptions()
				.AddAdminClientConfigOptions()
				.AddWatermarkOffsetsMessageConsumerOptions()
				.AddMessagesReaderServiceOptions();

			// Add services to the container.
			builder.Services.AddSingleton<AdminClientPool>();
			builder.Services.AddSingleton<WatermarkOffsetsClientPool>();
			builder.Services.AddSingleton<ProducersPool>();
			builder.Services.AddSingleton<MessagesConsumerPool>();


			builder.Services.AddSingleton<IClusterService, ClusterService>();
			builder.Services.AddSingleton<IBrokersService, BrokersService>();
			builder.Services.AddSingleton<ITopicsService, TopicsService>();
			builder.Services.AddSingleton<IWatermarkOffsetsService, WatermarkOffsetsService>();
			builder.Services.AddSingleton<IMessagesReaderService, MessagesReaderService>();
			builder.Services.AddSingleton<IMessagesWriterService, MessagesWriterService>();
			builder.Services.AddSingleton<ISettingsService, SettingsService>();
			builder.Services.AddSingleton<IConsumersService, ConsumersService>();

			// Register custom constraint
			builder.Services.Configure<RouteOptions>(options =>
			{
				options.ConstraintMap.Add("clusterIndex", typeof(ClusterIndexConstraint));
				options.ConstraintMap.Add("topicName", typeof(KafkaTopicConstraint));
			});

			builder.Services.AddCors(options =>
			{
				options.AddPolicy(
					name: "dev",
					policy =>
					{
						policy.WithOrigins("http://localhost:4200", "https://localhost:4200");
						policy.AllowAnyHeader();
						policy.AllowAnyMethod();
					}
				);
			});			
			

			////////////////////////////////////////////////////////////////
			
			builder.Services.AddControllers(options =>
			{
				options.Filters.Add<ApiExceptionFilter>();
			});

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				// Debug endpoint to list all routes
				app.MapGet(
					"/debug/routes",
					(IEnumerable<EndpointDataSource> endpointSources) =>
					{
						var sb = new StringBuilder();

						foreach (var endpoint in endpointSources.SelectMany(es => es.Endpoints))
						{
							if (endpoint is RouteEndpoint routeEndpoint)
							{
								var pattern = routeEndpoint.RoutePattern.RawText;
								var methods = endpoint
									.Metadata.OfType<HttpMethodMetadata>()
									.FirstOrDefault()
									?.HttpMethods;

								sb.AppendLine(
									$"{string.Join(",", methods ?? new[] { "ANY" })} {pattern}"
								);
							}
						}

						return sb.ToString();
					}
				);
			}			

			app.UseCors("dev");

			app.UseAuthorization();

			app.MapControllers();

			app.Run();
		}
	}
}
