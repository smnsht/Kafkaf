using Confluent.Kafka;
using Kafkaf.Web.Components.Pages.Topics;
using Kafkaf.Web.Config;
using Kafkaf.Web.Mappers;
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


	public IEnumerable<MessageViewModel<string, string>> ReadMessages(string topic, CancellationToken ct = default)
	{
		if (_clusterConfig == null)
		{
			throw new InvalidOperationException("cluster config is not set");
		}

		var config = new ConsumerConfig
		{
			BootstrapServers = _clusterConfig.Address,
			GroupId = "peek-client", // required even for Assign()
			EnableAutoCommit = false,
			AutoOffsetReset = AutoOffsetReset.Earliest
		};

		using var consumer = new ConsumerBuilder<byte[]?, byte[]?>(config)
			.Build();

		var partition = new Partition(0);
		//consumer.Assign(new TopicPartition(topic, partition));
		consumer.Assign(new TopicPartitionOffset(topic, partition, Offset.Beginning));

		// Trigger assignment to become active
		//consumer.Consume(TimeSpan.FromMilliseconds(1));

		// Optional: seek to a specific offset (e.g., beginning)
		//consumer.Seek(new TopicPartitionOffset(topic, partition, Offset.Beginning));

		var messages = new List<MessageViewModel<string, string>>();

		// TODO: draft limited to reading up to 256, have to decide about paging/limiting
		for (var i = 0; i < 256 && !ct.IsCancellationRequested; i++)
		{
			var cr = consumer.Consume(TimeSpan.FromSeconds(1));

			if (MessageMapper.TryMapMessage(cr) is MessageViewModel<string, string> messageModel)
			{
				messages.Add(messageModel);
				//yield return messageModel;
			}
			else
			{
				// No more messages right now — we've reached the "end"
				break;
			}
		}		

		consumer.Close();

		return messages.ToList();
	}

	//private IEnumerable<MessageViewModel<string, string>> Foo(IConsumer<byte[]?, byte[]?> consumer, CancellationToken ct)
	//{
	//	// TODO: draft limited to reading up to 256, have to decide about paging/limiting
	//	for (var i = 0; i < 256 && !ct.IsCancellationRequested; i++)
	//	{
	//		var cr = consumer.Consume(TimeSpan.FromSeconds(1));

	//		if (MessageMapper.TryMapMessage(cr) is MessageViewModel<string, string> messageModel)
	//		{				
	//			yield return messageModel; ;
	//		}
	//		else
	//		{
	//			// No more messages right now — we've reached the "end"
	//			break;
	//		}
	//	}
	//}

	public async Task<List<MessageViewModel<string, string>>> ReadMessagesAsync_old(string topic, CancellationToken ct = default)
	{		
		if (_clusterConfig == null)
		{
			throw new InvalidOperationException("cluster config is not set");
		}

		var config = new ConsumerConfig
		{
			BootstrapServers = _clusterConfig.Address,
			GroupId = "peek-client",//new DateTimeOffset(DateTime.UtcNow).ToUnixTimeMilliseconds().ToString(),
			EnableAutoCommit = false,
			AutoOffsetReset = AutoOffsetReset.Earliest
		};

		using var consumer = new ConsumerBuilder<byte[]?, byte[]?>(config)
			.Build();
		
		consumer.Subscribe(topic);

		var messages = new List<MessageViewModel<string, string>>();

		await Task.Run(() =>
		{
			// TODO: draft limited to reading up to 256, have to decide about paging/limiting
			for (var i = 0; i < 256 && !ct.IsCancellationRequested; i++)
			{
				var cr = consumer.Consume(TimeSpan.FromSeconds(1));

				if (MessageMapper.TryMapMessage(cr) is MessageViewModel<string, string> messageModel)
				{
					messages.Add(messageModel);
				}
				else
				{
					// No more messages right now — we've reached the "end"
					break;
				}					
			}			
		}, ct);
		
		consumer.Close();

		return messages;
	}		
}
