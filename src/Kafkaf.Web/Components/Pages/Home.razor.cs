using Confluent.Kafka;
using Kafkaf.DataAccess;
using Kafkaf.Web.Config;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web.Components.Pages;

public struct ClusterInfoRow
{
    public string ClusterName;
    public string Version = "";
    public DateTime? LastCheck = null;
    public bool? ok = null;
    public int? BrokersCount = null;
    public int? PartitionsCount = null;
    public int? TopicsCount = null;
    public int? Production = null;
    public int? Consumption = null;

    public ClusterInfoRow(string clusterName)
    {
        ClusterName = clusterName;
    }
};

public partial class Home : ComponentBase
{
    [Inject]
    public required IOptions<List<ClusterConfigOptions>> ClusterOptions { get; set; }

    [Inject]
    public required IMemoryCache MemoryCache { get; set; }

    public bool loading = false;

    public ClusterInfoRow[] clusters = [];

    protected override void OnInitialized()
    {
        clusters = ClusterOptions.Value
            .Select(opt => new ClusterInfoRow(opt.Alias))
            .ToArray();

        base.OnInitialized();
    }

    private async Task HandlePingServers()
    {
        loading = true;

        var pingService = new ClusterPingService();

        for (int i = 0; i < clusters.Length; i++)
        {
            var opt = ClusterOptions.Value[i];
            var (m, ex) = await pingService.PingServerAsync(opt.Address);
            //var tableRow = clusters[i];
            var cacheKey = opt.CacheKey();

            clusters[i].LastCheck = DateTime.Now;

            if (m is Metadata meta)
            {
                clusters[i].ok = true;
                MemoryCache.Set(cacheKey, meta, TimeSpan.FromMinutes(60));// TODO
            }
            else
            {
                clusters[i].ok = false;
                MemoryCache.Remove(cacheKey);
            }
        }               

        loading = false;        
    }
}
