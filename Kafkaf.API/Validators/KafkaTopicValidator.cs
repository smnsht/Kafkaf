using System.Text.RegularExpressions;

namespace Kafkaf.API.Validators;

public class KafkaTopicValidator
{
	// Regex: only letters, digits, dot, underscore, hyphen
	private static readonly Regex TopicNameRegex = new Regex(
		@"^[a-zA-Z0-9._-]+$",
		RegexOptions.Compiled,
		matchTimeout: TimeSpan.FromSeconds(1) // make SonarCloud happy :-)
	);

	public static bool IsValidTopicName(string? topicName, out string? error)
	{
		if (string.IsNullOrEmpty(topicName))
		{
			error = "Topic name must be not empty.";
			return false;
		}

		// Length check (1–249)
		if (topicName.Length < 1 || topicName.Length > 249)
		{
			error = "Invalid Kafka topic name length. Must be between 1 and 249 characters.";
			return false;
		}

		// Character check
		if (!TopicNameRegex.IsMatch(topicName))
		{
			error =
				"Invalid Kafka topic name characters. Allowed characters are a–z, A–Z, 0–9, '.', '_', '-'.";
			return false;
		}

		error = null;

		return true;
	}
}
