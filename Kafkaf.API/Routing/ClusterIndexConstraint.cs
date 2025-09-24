using Kafkaf.API.Config;

namespace Kafkaf.API.Routing;

public class ClusterIndexConstraint : IRouteConstraint
{
	private readonly ILogger<ClusterIndexConstraint> _logger;
	private readonly int _maxIndex;

	public ClusterIndexConstraint(
		ILogger<ClusterIndexConstraint> loggger,
		IReadOnlyList<ClusterConfigOptions> clusters
	)
	{
		_logger = loggger;
		_maxIndex = clusters.Count - 1;
	}

	public bool Match(
		HttpContext? httpContext,
		IRouter? route,
		string routeKey,
		RouteValueDictionary values,
		RouteDirection routeDirection
	)
	{
		if (!values.TryGetValue(routeKey, out var raw) || raw == null)
		{
			_logger.LogDebug(
				"Cluster index route value '{RouteKey}' is missing or null.",
				routeKey
			);
			return false;
		}

		if (!int.TryParse(raw.ToString(), out var idx))
		{
			_logger.LogDebug(
				"Cluster index route value '{RouteKey}' could not be parsed as an integer. Raw value: {RawValue}",
				routeKey,
				raw
			);
			return false;
		}

		if (idx < 0 || idx > _maxIndex)
		{
			_logger.LogDebug(
				"Cluster index {Index} is out of range. Valid range: 0 to {MaxIndex}.",
				idx,
				_maxIndex
			);
			return false;
		}

		return true;
	}
}
