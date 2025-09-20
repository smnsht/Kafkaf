using Confluent.Kafka.Admin;

namespace Kafkaf.API.ViewModels;

public record BrokerConfigRow(bool IsDefault, bool IsReadOnly, bool IsSensitive, string Name, string Value, string Source)
{
	public static BrokerConfigRow[] FromResult(DescribeConfigsResult result)
	{
		var rows = result.Entries
				.Select(entry => entry.Value)
				.Select(entry => new BrokerConfigRow(
					IsDefault: entry.IsDefault,
					IsReadOnly: entry.IsReadOnly,
					IsSensitive: entry.IsSensitive,
					Name: entry.Name,
					Value: entry.Value,
					Source: entry.Source.ToString()
				));

		return rows.ToArray();
	}
}
