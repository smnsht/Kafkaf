using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Models;

public record PatchSettingModel(string name, string value) : IValidatableObject
{
	public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
	{
		if (KafkaTopicProperties.TOPIC_CONFIGS.TryGetValue(name, out var topicConfigs))
		{
			var error = topicConfigs.Type switch
			{
				"long" => long.TryParse(value, out _) ? null : "Invalid long.",
				"double" => double.TryParse(value, out _) ? null : "Invalid double.",
				"boolean" => bool.TryParse(value, out _) ? null : "Invalid boolean.",
				"int" => int.TryParse(value, out _) ? null : "Invalid int.",
				"string" => name switch
				{
					"compression.type" => KafkaTopicProperties.COMPRESSION_TYPES.Contains(value)
						? null
						: "Invalid compression.type.",
					"message.timestamp.type" =>
						KafkaTopicProperties.MESSAGE_IMESTAMP_TYPES.Contains(value)
							? null
							: "Invalid message.timestamp.type.",
					_ => throw new InvalidOperationException($"unknown string setting: ${name}!"),
				},
				_ => throw new InvalidOperationException(
					$"unknown config type {topicConfigs.Type} for setting {name}!"
				),
			};

			if (string.IsNullOrEmpty(error))
			{
				yield break;
			}

			yield return new ValidationResult(error);
		}

		yield return new ValidationResult("Unknown topic name.");
	}
}
