using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record BrokerInfoRow(int BrokerID, int Port, string Host);
public class BrokersInfoViewModel
{
	public int Controller { get; set; } = -1;
	public BrokerInfoRow[] Brokers { get; init; } = [];

	public static BrokersInfoViewModel FromResult(DescribeClusterResult result)
	{
		// The controller broker ID
		var controllerId = result.Controller.Id;

		return new BrokersInfoViewModel()
		{
			Controller = controllerId,
			Brokers = result.Nodes.Select(node =>
			{
				var row = new BrokerInfoRow(
					BrokerID: node.Id,
					Port: node.Port,
					Host: node.Host);

				return row;
			}).ToArray()
		};
	}
}
