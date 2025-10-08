using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record BrokerInfoRow(int BrokerID, int Port, string Host, int Controller)
{
	public static BrokerInfoRow[] FromResult(DescribeClusterResult result)
	{
		// The controller broker ID
		var ctrl = result.Controller.Id;

		return result
			.Nodes.Select(node =>
			{
				return new BrokerInfoRow(
					BrokerID: node.Id,
					Port: node.Port,
					Host: node.Host,
					Controller: ctrl
				);
			})
			.OrderBy(row => row.BrokerID)
			.ToArray();
	}
}
