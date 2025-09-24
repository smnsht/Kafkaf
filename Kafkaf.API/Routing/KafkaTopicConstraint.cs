using Kafkaf.API.Validators;

namespace Kafkaf.API.Routing;

public class KafkaTopicConstraint : IRouteConstraint
{
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
		if (!KafkaTopicValidator.IsValidTopicName(topicName, out var error))
		{
			_logger.LogDebug(error);
			return false;
		}
		
		return true;
	}
}
