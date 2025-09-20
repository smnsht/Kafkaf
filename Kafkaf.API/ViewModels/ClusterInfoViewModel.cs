using Confluent.Kafka;

namespace Kafkaf.API.ViewModels;

public class ClusterInfoViewModel
{
	public required string Name { get; set; }
	public int? DefaultCluster { get; set; }
	public string Status { get; set; } = "online";
	public string? LastError { get; set; }
	public int BrokerCount { get; set; }
	public int OnlinePartitionCount { get; set; }
	public int TopicCount { get; set; }
	public int? BytesInPerSec { get; set; }
	public int BytesOutPerSec { get; set; }
	public bool ReadOnly { get; set; }
	public required string Version { get; set; }
	public ClusterFeature[] Features { get; set; } = [];

	public static ClusterInfoViewModel FromMetadata(Metadata meta)
	{
		ArgumentNullException.ThrowIfNull(meta, nameof(meta));

		return new ClusterInfoViewModel()
		{
			Name = meta.OriginatingBrokerName,
			Version = "todo",
			BrokerCount = meta.Brokers.Count,
			OnlinePartitionCount = 0,// TODO
			TopicCount = meta.Topics.Count,
		};
	}
}
