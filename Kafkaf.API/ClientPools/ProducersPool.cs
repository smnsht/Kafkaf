using Confluent.Kafka;
using Kafkaf.API.Config;

namespace Kafkaf.API.ClientPools;

public class ProducersPool : AbstractClientPool<IProducer<byte[]?, byte[]?>>
{
	public ProducersPool(IReadOnlyList<ClusterConfigOptions> clusterConfigs)
		: base(clusterConfigs) { }

	protected override IProducer<byte[]?, byte[]?> BuildClient(ClusterConfigOptions clusterConfig)
	{
		var config = new ProducerConfig
		{
			BootstrapServers = clusterConfig.Address,
			SaslUsername = clusterConfig.SaslUsername,
			SaslPassword = clusterConfig.SaslPassword,
			SaslMechanism = clusterConfig.SaslMechanism,
			SecurityProtocol = clusterConfig.SecurityProtocol,
		};

		return new ProducerBuilder<byte[]?, byte[]?>(config).Build();
	}
}
