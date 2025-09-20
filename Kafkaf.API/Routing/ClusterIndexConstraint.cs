using Kafkaf.API.Config;

namespace Kafkaf.API.Routing;

public class ClusterIndexConstraint : IRouteConstraint
{
	private readonly int _maxIndex;

	public ClusterIndexConstraint(IReadOnlyList<ClusterConfigOptions> clusters) =>
		_maxIndex = clusters.Count - 1;

	public bool Match(HttpContext? httpContext,
					  IRouter? route,
					  string routeKey,
					  RouteValueDictionary values,
					  RouteDirection routeDirection)
	{
		if (!values.TryGetValue(routeKey, out var raw)) return false;
		if (!int.TryParse(raw?.ToString(), out var idx)) return false;

		return idx >= 0 && idx <= _maxIndex;
	}	
}
