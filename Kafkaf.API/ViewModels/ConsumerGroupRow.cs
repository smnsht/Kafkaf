using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record ConsumerGroupRow(
	string GroupId,
	int ActiveConsumers,
	int ConsumerLag,
	int Coordinator,
	string State
)
{
	public static ConsumerGroupRow FromConsumerGroupListing(ConsumerGroupListing listing) =>
		new ConsumerGroupRow(
			GroupId: listing.GroupId,
			ActiveConsumers: -1,
			ConsumerLag: -1,
			Coordinator: -1,
			State: listing.State.ToString()
		);
}
