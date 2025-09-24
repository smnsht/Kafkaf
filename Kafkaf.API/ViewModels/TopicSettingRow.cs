using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record TopicSettingRow(string Name, string Value, string? DefaultValue = null)
{
	public static TopicSettingRow[] FromResult(DescribeConfigsResult result)
	{
		var rows = result
			.Entries.Select(entry => entry.Value)
			.Select(entry => new TopicSettingRow(entry.Name, entry.Value));

		return rows.ToArray();
	}
}
