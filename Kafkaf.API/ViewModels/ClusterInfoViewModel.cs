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
}
