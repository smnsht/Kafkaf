using Kafkaf.Config;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Kafkaf.Components.UI;

public class ClusterIndexAwarePage: ComponentBase
{
    [Parameter]
    public int clusterIdx { get; set; }

    [Inject]
    public required IOptions<List<ClusterConfigOptions>> ClusterOptions { get; set; }

    [Inject]
    public required IMemoryCache MemoryCache { get; set; }

    protected ClusterConfigOptions ClusterConfig
    {
        get => ClusterOptions.Value[clusterIdx - 1];
    }
}
