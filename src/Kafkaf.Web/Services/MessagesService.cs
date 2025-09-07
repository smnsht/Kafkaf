using System.Text;
using Confluent.Kafka;
using Kafkaf.Web.Components.Pages.Topics;
using Kafkaf.Web.Config;
using Kafkaf.Web.ViewModels;

namespace Kafkaf.Web.Services;

public class MessagesService
{
	private readonly ILogger<MessagesService> _logger;	

	protected ClusterConfigOptions? _clusterConfig;

	public MessagesService(ILogger<MessagesService> logger) => _logger = logger;

	public MessagesService SetClusterConfigOptions(ClusterConfigOptions clusterConfig)
	{
		_clusterConfig = clusterConfig;		

		return this;
	}

	public async Task<MessageViewModel<string, string>[]> ReadMessagesAsync(string topic, CancellationToken cancellationToken = default)
	{		
		if (_clusterConfig == null)
		{
			throw new InvalidOperationException("cluster config is not set");
		}

		var config = new ConsumerConfig
		{
			BootstrapServers = _clusterConfig.Address,
			GroupId = "my-consumer-group",
			EnableAutoCommit = false,
			AutoOffsetReset = AutoOffsetReset.Earliest
		};

		using var consumer = new ConsumerBuilder<byte[]?, byte[]?>(config)
			.Build();
		
		consumer.Subscribe(topic);

		List<MessageViewModel<string, string>> retval = new();

		await Task.Run(() =>
		{
			while (!cancellationToken.IsCancellationRequested)
			{
				var cr = consumer.Consume(TimeSpan.FromSeconds(1));
				if (cr is ConsumeResult<byte[]?, byte[]?> result && cr.Message is Message<byte[]?, byte[]?> msg)
				{
					//Console.WriteLine($"[{cr.TopicPartitionOffset}] {cr.Message.Value}");					
					var messageModel = new MessageViewModel<string, string>()
					{					
						Key = msg.Key is byte[] bytesKey ? Encoding.UTF8.GetString(bytesKey) : string.Empty,
						Value = msg.Value is byte[] bytesVal ? Encoding.UTF8.GetString(bytesVal) : string.Empty,
						Offset = (ulong)result.Offset.Value,
						Partition = (uint)result.Partition.Value,
						Timestamp = msg.Timestamp.UtcDateTime
					};

					retval.Add(messageModel);
				}
				else
				{
					// No more messages right now — we've reached the "end"
					break;
				}
			}
		}, cancellationToken);

		consumer.Close();

		return retval.ToArray();
	}
}
