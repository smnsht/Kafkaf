using Confluent.Kafka;
using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record ConsumerGroupRow(
	string GroupId,
	int NumberOfMembers,
	int NumberOfTopics,
	int ConsumerLag,
	int Coordinator,
	string State
)
{
	public static IEnumerable<ConsumerGroupRow> FromConsumerGroupDescription(
		IEnumerable<ConsumerGroupDescription> groups
	) => groups.Select(FromConsumerGroupDescription);

	public static ConsumerGroupRow FromConsumerGroupDescription(ConsumerGroupDescription listing) =>
		new ConsumerGroupRow(
			GroupId: listing.GroupId,
			NumberOfMembers: listing.Members.Count,
			NumberOfTopics: listing
				.Members.SelectMany(m =>
					m.Assignment?.TopicPartitions ?? Enumerable.Empty<TopicPartition>()
				)
				.Select(tp => tp.Topic)
				.Distinct()
				.Count(),
			ConsumerLag: -1,
			Coordinator: listing.Coordinator.Id,
			State: listing.State.ToString()
		);
}
