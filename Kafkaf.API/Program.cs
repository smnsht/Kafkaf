using System.Text;
using Kafkaf.API.Config;
using Kafkaf.API.Routing;
using Kafkaf.API.Services;

namespace Kafkaf.API
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			builder
				.ConfigureClusterConfigOptions()
				.AddAdminClientConfigOptions();

			// Add services to the container.
			builder.Services.AddSingleton<AdminClientPool>();
			builder.Services.AddTransient<ClusterService>();
			builder.Services.AddTransient<BrokersService>();

			// Register custom constraint
			builder.Services.Configure<RouteOptions>(options =>
			{
				options.ConstraintMap.Add("clusterIndex", typeof(ClusterIndexConstraint));
			});

			builder.Services.AddControllers();

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				// Debug endpoint to list all routes
				app.MapGet("/debug/routes", (IEnumerable<EndpointDataSource> endpointSources) =>
				{
					var sb = new StringBuilder();

					foreach (var endpoint in endpointSources.SelectMany(es => es.Endpoints))
					{
						if (endpoint is RouteEndpoint routeEndpoint)
						{
							var pattern = routeEndpoint.RoutePattern.RawText;
							var methods = endpoint.Metadata
								.OfType<HttpMethodMetadata>()
								.FirstOrDefault()?.HttpMethods;

							sb.AppendLine($"{string.Join(",", methods ?? new[] { "ANY" })} {pattern}");
						}
					}

					return sb.ToString();
				});
			}

			app.UseAuthorization();


			app.MapControllers();

			app.Run();
		}
	}
}
