using Confluent.Kafka;
using Kafkaf.API.Config;

namespace Kafkaf.API.ClientPools;

public class AdminClientPool : AbstractClientPool<IAdminClient>
{
	public AdminClientPool(IReadOnlyList<ClusterConfigOptions> clusterConfigs)
		: base(clusterConfigs) { }

	protected override IAdminClient BuildClient(ClusterConfigOptions clusterConfig)
	{
		var config = new AdminClientConfig { BootstrapServers = clusterConfig.Address };
		return new AdminClientBuilder(config).Build();
	}
}
