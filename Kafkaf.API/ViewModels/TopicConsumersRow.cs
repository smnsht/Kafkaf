using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record TopicConsumersRow(
	string GroupId,
	int ActiveConsumers,
	int ConsumerLag,
	int Coordinator,
	string State
)
{
	public static IEnumerable<TopicConsumersRow> FromConsumerGroupDescription(
		IEnumerable<ConsumerGroupDescription> groups
	) => groups.Select(FromConsumerGroupDescription);

	public static TopicConsumersRow FromConsumerGroupDescription(ConsumerGroupDescription group) =>
		new TopicConsumersRow(
			GroupId: group.GroupId,
			ActiveConsumers: group.Members.Count,
			ConsumerLag: -1,
			Coordinator: group.Coordinator.Id,
			State: group.State.ToString()
		);
}
