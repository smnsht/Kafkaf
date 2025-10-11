using Kafkaf.API.Models;

namespace Kafkaf.API.ViewModels;

public record TopicConfigRow(string key, string type, string defaultValue)
{
	public static TopicConfigRow[] FromDictionary(
		Dictionary<string, (string Type, string DefaultValue)> dict
	) =>
		dict.Select(kvp =>
			{
				var v = kvp.Value;
				return new TopicConfigRow(kvp.Key, v.Type, v.DefaultValue);
			})
			.ToArray();

	public static TopicConfigRow[] FromDefault() =>
		FromDictionary(KafkaTopicProperties.TopicConfigs);
}
