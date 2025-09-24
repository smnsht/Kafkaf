using Confluent.Kafka;
using Kafkaf.API.Config;
using Kafkaf.API.Models;
using Microsoft.Extensions.Options;

namespace Kafkaf.API.Services;

public class MessagesReaderService
{
	private readonly ILogger<MessagesReaderService> _logger;
	private readonly MessagesReaderServiceOptions _options;
	private readonly IReadOnlyList<ClusterConfigOptions> _clusterConfigs;

	internal record ReadingContext(
		int clusterIdx,
		string topicName,
		ReadMessagesRequest request,
		IConsumer<byte[]?, byte[]?> consumer,
		CancellationToken token
	) : IDisposable
	{
		public void Dispose() => consumer?.Dispose();
	}

	public MessagesReaderService(
		ILogger<MessagesReaderService> logger,
		IOptions<MessagesReaderServiceOptions> options,
		IReadOnlyList<ClusterConfigOptions> clusterConfigs
	)
	{
		_logger = logger;
		_options = options.Value;
		_clusterConfigs = clusterConfigs;
	}

	// TODO: create Stream
	public List<ConsumeResult<byte[]?, byte[]?>> ReadMessagesBackwards(
		int clusterIdx,
		string topicName,
		ReadMessagesRequest request,
		CancellationToken ct
	)
	{
		var messages = new List<ConsumeResult<byte[]?, byte[]?>>();

		using (var consumer = _buildConsumer(clusterIdx))
		{
			// Get metadata to discover partitions
			var partitions = request
				.PartitionsAsInt.Select(p => new TopicPartition(topicName, new Partition(p)))
				.ToList();

			foreach (var tp in partitions)
			{
				// Query watermarks for this partition
				var watermark = consumer.QueryWatermarkOffsets(tp, TimeSpan.FromSeconds(5));
				var lastOffset = watermark.High - 1;

				// Walk backwards through this partition
				for (var offset = lastOffset; offset >= watermark.Low; offset--)
				{
					if (ct.IsCancellationRequested || messages.Count > _options.MaxMessages)
					{
						break;
					}

					var tpo = new TopicPartitionOffset(tp, new Offset(offset));
					consumer.Assign(tpo);

					var cr = consumer.Consume(TimeSpan.FromSeconds(2));

					if (cr is null || cr.IsPartitionEOF)
					{
						// No more messages right now — we've reached the "end"
						break;
					}

					messages.Add(cr);
				}
			}
		}

		return messages;
	}

	public List<ConsumeResult<byte[]?, byte[]?>> ReadMessages(
		int clusterIdx,
		string topicName,
		ReadMessagesRequest request,
		CancellationToken ct
	)
	{
		using (
			var ctx = new ReadingContext(
				clusterIdx: clusterIdx,
				topicName: topicName,
				request: request,
				consumer: _buildConsumer(clusterIdx),
				token: ct
			)
		)
		{
			_assignTopicPartitions(ctx);
			return _consume(ctx);
		}
	}

	internal IConsumer<byte[]?, byte[]?> _buildConsumer(int clusterIdx)
	{
		var clusterConfig =
			_clusterConfigs[clusterIdx]
			?? throw new ArgumentOutOfRangeException(nameof(clusterIdx));

		var config = new ConsumerConfig
		{
			BootstrapServers = clusterConfig.Address,
			GroupId = _options.GroupId,
			EnableAutoCommit = false,
			AutoOffsetReset = AutoOffsetReset.Earliest,
		};

		return new ConsumerBuilder<byte[]?, byte[]?>(config).Build();
	}

	internal void _assignTopicPartitions(ReadingContext ctx)
	{
		var topicPartitions = ctx
			.request.Partitions.Split(',')
			.Select(sPartition => new TopicPartitionOffset(
				topic: ctx.topicName,
				partition: int.Parse(sPartition),
				offset: ctx.request.seekDirection == SeekDirection.BACKWARD
					? Offset.End
					: Offset.Beginning
			));

		ctx.consumer.Assign(topicPartitions);
	}

	internal List<ConsumeResult<byte[]?, byte[]?>> _consume(ReadingContext ctx)
	{
		var consumer = ctx.consumer;
		var timeout = TimeSpan.FromSeconds(_options.ConsumeTimeoutInSeconds);
		var messages = new List<ConsumeResult<byte[]?, byte[]?>>();

		for (var i = 0; i <= _options.MaxMessages && !ctx.token.IsCancellationRequested; i++)
		{
			var cr = consumer.Consume(timeout);

			if (cr is null || cr.IsPartitionEOF)
			{
				// No more messages right now — we've reached the "end"
				break;
			}

			messages.Add(cr);
		}

		return messages;
	}
}
