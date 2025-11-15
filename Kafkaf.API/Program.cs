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
            // csharpier-ignore-start
			builder.Services.AddSingleton<IClusterService, ClusterService>();
			builder.Services.AddSingleton<IBrokersService, BrokersService>();
			builder.Services.AddSingleton<ITopicsService, TopicsService>();
			builder.Services.AddSingleton<IWatermarkOffsetsService, WatermarkOffsetsService>();
			builder.Services.AddSingleton<IMessagesReaderService, MessagesReaderService>();
			builder.Services.AddSingleton<IMessagesWriterService, MessagesWriterService>();
			builder.Services.AddSingleton<ISettingsService, SettingsService>();
			builder.Services.AddSingleton<IConsumersService, ConsumersService>();
            // csharpier-ignore-end

            // Register custom constraint
            builder.Services.Configure<RouteOptions>(options =>
            {
                options.ConstraintMap.Add("clusterIndex", typeof(ClusterIndexConstraint));
                options.ConstraintMap.Add("topicName", typeof(KafkaTopicConstraint));
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                    name: "default",
                    policy =>
                    {
                        policy.WithOrigins(GetAllowedOrigins(builder.Configuration));
                        policy.AllowAnyHeader();
                        policy.AllowAnyMethod();
                    }
                );
            });

            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<ApiExceptionFilter>();
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {                
                app.MapGet("/debug/routes", ListAllRoutes);
            }
			 
            // csharpier-ignore-start
			if (bool.TryParse(app.Configuration["USE_STATIC_FILES"], out var useStaticFiles) && useStaticFiles)
			{
				// Enable default file mapping (index.html, default.html, etc.)
				app.UseDefaultFiles();

				// Enable serving static files (from wwwroot by default)
				app.UseStaticFiles();
			}
            // csharpier-ignore-end

            app.UseCors("default");

            app.MapControllers();

            app.Run();
        }

        internal static string[] GetAllowedOrigins(IConfiguration configuration)
        {
            var allowedOrigins = configuration
                .GetSection("Cors:AllowedOrigins")
                .Get<string[]>();

            if (allowedOrigins == null || allowedOrigins.Length == 0)
            {
                throw new InvalidOperationException(
                    "CORS configuration is missing: Cors:AllowedOrigins must be set in appsettings or environment variables."
                );
            }

            return allowedOrigins;
        }

		internal static string ListAllRoutes(IEnumerable<EndpointDataSource> endpointSources)
		{
			var sb = new StringBuilder();
			// csharpier-ignore
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
    }
}
