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
                "long" => _validateLong(value),
                "double" => _validateDouble(value),
                "boolean" => _validateBoolean(value),
                "int" => _validateInt(value),
                "string" => _validateStringConfig(name, value),
                _ => $"unknown topic config type: ${topicConfigs.Type}.",
            };

            if (string.IsNullOrEmpty(error))
            {
                yield break;
            }

            yield return new ValidationResult(error);
        }

        yield return new ValidationResult($"Unknown topic config name '${name}'.");
    }

    internal static string? _validateLong(string value) =>
        long.TryParse(value, out _) ? null : "Invalid long.";

    internal static string? _validateDouble(string value) =>
        double.TryParse(value, out _) ? null : "Invalid double.";

    internal static string? _validateBoolean(string value) =>
        bool.TryParse(value, out _) ? null : "Invalid boolean.";

    internal static string? _validateInt(string value) =>
        int.TryParse(value, out _) ? null : "Invalid int.";

    internal static string? _validateStringConfig(string name, string value) =>
        name switch
        {
            "compression.type" => KafkaTopicProperties.COMPRESSION_TYPES.Contains(value)
                ? null
                : "Invalid compression.type.",
            "message.timestamp.type" =>
                KafkaTopicProperties.MESSAGE_IMESTAMP_TYPES.Contains(value)
                    ? null
                    : "Invalid message.timestamp.type.",
            _ => $"unknown string setting: ${name}!",
        };
}
