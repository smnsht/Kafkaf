using Confluent.Kafka;
using Kafkaf.API.ClientPools;
using Kafkaf.API.Models;

namespace Kafkaf.API.Services;

public class MessagesWriterService
{
    private readonly ProducersPool _pool;

    public MessagesWriterService(ProducersPool pool) => _pool = pool;

    public async Task<DeliveryResult<byte[]?, byte[]?>> CreateMessageAsync(
        int clusterIdx,
        string topicName,
        CreateMessageModel model,
        CancellationToken ct
    )
    {
        var msg = new Message<byte[]?, byte[]?>
        {
            Key = model.KeyBytes,
            Value = model.ValueBytes,
            Headers = model.MessageHeaders,
        };

        var producer = _pool.GetClient(clusterIdx);
        var partition = model.Partition.HasValue
            ? new Partition(model.Partition.Value)
            : new Partition();
        var tp = new TopicPartition(topicName, partition);
        return await producer.ProduceAsync(tp, msg, ct);
    }
}
