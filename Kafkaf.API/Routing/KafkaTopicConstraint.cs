using System.Text.RegularExpressions;

namespace Kafkaf.API.Routing;

public class KafkaTopicConstraint : IRouteConstraint
{
	private static readonly Regex TopicNameRegex = new Regex(
		@"^[a-zA-Z0-9._-]+$",
		RegexOptions.Compiled
	);

	private readonly ILogger<KafkaTopicConstraint> _logger;

	public KafkaTopicConstraint(ILogger<KafkaTopicConstraint> logger) => _logger = logger;

	public bool Match(
		HttpContext? httpContext,
		IRouter? route,
		string routeKey,
		RouteValueDictionary values,
		RouteDirection routeDirection
	)
	{
		if (!values.TryGetValue(routeKey, out var value) || value == null)
		{
			_logger.LogDebug("Route value for '{RouteKey}' is missing or null.", routeKey);
			return false;
		}

		var topicName = value.ToString();

		// Length check
		if (string.IsNullOrEmpty(topicName) || topicName.Length < 1 || topicName.Length > 249)
		{
			_logger.LogDebug(
				"Invalid Kafka topic name length: {TopicName} (length {Length}). Must be between 1 and 249 characters.",
				topicName,
				topicName?.Length ?? 0
			);
			return false;
		}

		// Allowed characters
		if (!TopicNameRegex.IsMatch(topicName))
		{
			_logger.LogDebug(
				"Invalid Kafka topic name characters: {TopicName}. Allowed characters are a–z, A–Z, 0–9, '.', '_', '-'.",
				topicName
			);
			return false;
		}

		return true;
	}
}
