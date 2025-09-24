using Confluent.Kafka;

namespace Kafkaf.API.ViewModels;

public class ClusterInfoViewModel
{
	public required string Alias { get; set; }
	public required string Version { get; set; }
	public int BrokerCount { get; set; }
	public int OnlinePartitionCount { get; set; }
	public int TopicCount { get; set; }
	public string? OriginatingBrokerName { get; set; }
	public int OriginatingBrokerId { get; set; }
	public bool IsOffline { get; set; }
	public string? Error { get; set; }

	//public int? DefaultCluster { get; set; }
	//public string Status { get; set; } = "online";
	//public string? LastError { get; set; }
	//public int? BytesInPerSec { get; set; }
	//public int BytesOutPerSec { get; set; }
	//public bool ReadOnly { get; set; }=
	//public ClusterFeature[] Features { get; set; } = [];

	public static ClusterInfoViewModel FromMetadata(string alias, Metadata meta)
	{
		ArgumentNullException.ThrowIfNull(meta, nameof(meta));

		// Sum partitions across all topics
		var totalPartitions = meta
			.Topics.Where(t => !t.Error.IsError) // skip internal/errored topics
			.Sum(t => t.Partitions.Count);

		return new ClusterInfoViewModel()
		{
			Alias = alias,
			Version = "TODO",
			BrokerCount = meta.Brokers.Count,
			OnlinePartitionCount = totalPartitions,
			TopicCount = meta.Topics.Count,
			OriginatingBrokerName = meta.OriginatingBrokerName,
			OriginatingBrokerId = meta.OriginatingBrokerId,
			IsOffline = false,
		};
	}

	public static ClusterInfoViewModel Offline(string alias, string error) =>
		new ClusterInfoViewModel()
		{
			Alias = alias,
			Version = "TODO",
			BrokerCount = -1,
			OnlinePartitionCount = -1,
			TopicCount = -1,
			OriginatingBrokerId = -1,
			IsOffline = true,
			Error = error,
		};
}
