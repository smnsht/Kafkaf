using Microsoft.AspNetCore.Components;

namespace Kafkaf.Components.Topic;

public enum TopicsTabs
{
    Overview,
    Messages,
    Consumers,
    Settings,
    Statistics
};

public partial class TopicComponent : ComponentBase
{
    public const string PATH_PART_OVERVIEW = "overview";
    public const string PATH_PART_MESSAGES = "messages";
    public const string PATH_PART_CONSUMERS = "consumers";
    public const string PATH_PART_SETTINGS = "settings";
    public const string PATH_PART_STATISTICS = "statistics";

    private const string ROUTE_BASE = "/{clusterIdx:int}/topics/{topicName}";

    public const string ROUTE_OVERVIEW = $"{ROUTE_BASE}/{PATH_PART_OVERVIEW}";
    public const string ROUTE_MESSAGES = $"{ROUTE_BASE}/{PATH_PART_MESSAGES}";
    public const string ROUTE_CONSUMERS = $"{ROUTE_BASE}/{PATH_PART_CONSUMERS}";
    public const string ROUTE_SETTINGS = $"{ROUTE_BASE}/{PATH_PART_SETTINGS}";
    public const string ROUTE_STATISTICS = $"{ROUTE_BASE}/{PATH_PART_STATISTICS}";

    [Parameter]
    public int ClusterIdx { get; set; }

    [Parameter]
    public string PageTitle { get; set; } = "?";

    [Parameter]
    public string TopicName { get; set; } = "?";

    [Parameter]
    public string CurrentPathPart { get; set; } = "?";
    
    private Dictionary<TopicsTabs, Tuple<string, string>> TabsConfig = new()
    {
        { TopicsTabs.Overview, new (PATH_PART_OVERVIEW, "Overview") },
        { TopicsTabs.Messages, new (PATH_PART_MESSAGES, "Messages") },
        { TopicsTabs.Consumers, new (PATH_PART_CONSUMERS, "Consumers") },
        { TopicsTabs.Settings, new (PATH_PART_SETTINGS, "Settings") },
        { TopicsTabs.Statistics, new (PATH_PART_STATISTICS, "Statistics") }
    };

    private MarkupString linkForTab(TopicsTabs tab)
    {
        var (pathPart, linkText) = TabsConfig[tab];
        var clazz = pathPart == CurrentPathPart
            ? "nav-link active"
            : "nav-link";
        var url = $"/{ClusterIdx}/topics/{TopicName}/{pathPart}";

        return new MarkupString($"<a class=\"{clazz}\" href=\"{url}\">{linkText}</a>");
    }
}
