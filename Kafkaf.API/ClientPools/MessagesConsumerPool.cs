using Confluent.Kafka;
using Kafkaf.API.Config;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.ClientPools;

public class MessagesConsumerPool : AbstractClientPool<IConsumer<byte[]?, byte[]?>>
{
    private readonly MessageConsumerOptions _options;

    public MessagesConsumerPool(
        IReadOnlyList<ClusterConfigOptions> clusterConfigs,
        IOptions<MessageConsumerOptions> options
    )
        : base(clusterConfigs) => _options = options.Value;

    protected override IConsumer<byte[]?, byte[]?> BuildClient(
        ClusterConfigOptions clusterConfig
    )
    {
        var consumer = new ConsumerBuilder<byte[]?, byte[]?>(
            new ConsumerConfig
            {
                BootstrapServers = clusterConfig.Address,
                SaslUsername = clusterConfig.SaslUsername,
                SaslPassword = clusterConfig.SaslPassword,
                SaslMechanism = clusterConfig.SaslMechanism,
                SecurityProtocol = clusterConfig.SecurityProtocol,
                GroupId = _options.GroupId,
                EnableAutoCommit = false,
            }
        ).Build();

        return consumer;
    }
}
