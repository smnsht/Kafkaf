using Microsoft.AspNetCore.Components;

namespace Kafkaf.Components.Partials.Broker;

public enum BrokerTabs
{
    LogDirectories,
    Configs,
    Metrics
}

public partial class BrokerComponent : ComponentBase
{    
    public const string PATH_PART_CONFIGS = "configs";
    public const string PATH_PART_METRICS = "metrics";

    public const string ROUTE_LOG_DIRS = ROUTE_BASE;
    public const string ROUTE_CONFIGS = $"{ROUTE_BASE}/{PATH_PART_CONFIGS}";
    public const string ROUTE_METRICS = $"{ROUTE_BASE}/{PATH_PART_METRICS}";

    private const string ROUTE_BASE = "/{clusterIdx:int}/brokers/{brokerIdx:int}";

    private Dictionary<BrokerTabs, Tuple<string, string>> TabsConfig = new()
    {
        { BrokerTabs.LogDirectories, new ("", "Log directores") },
        { BrokerTabs.Configs, new (PATH_PART_CONFIGS, "Configs") },
        { BrokerTabs.Metrics, new (PATH_PART_METRICS, "Metrics") }        
    };

    [Parameter]
    public int ClusterIdx { get; set; }

    [Parameter]
    public int BrokerIdx { get; set; }

    [Parameter]
    public string PageTitle { get; set; } = "?";

    [Parameter]
    public string PageHeading { get; set; } = "?";

    [Parameter]
    public string CurrentPathPart { get; set; } = "?";

    private MarkupString linkForTab(BrokerTabs tab)
    {
        var (pathPart, linkText) = TabsConfig[tab];
        var clazz = pathPart == CurrentPathPart
            ? "nav-link active"
            : "nav-link";

        var url = $"/{ClusterIdx}/brokers/{BrokerIdx}/{pathPart}";

        return new MarkupString($"<a class=\"{clazz}\" href=\"{url}\">{linkText}</a>");
    }
}
