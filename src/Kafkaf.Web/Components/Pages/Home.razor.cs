using Confluent.Kafka;
using Kafkaf.Web.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;

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

public partial class Home : ClusterIndexAwarePage
{
    public ClusterInfoRow[] clusters = [];

    [Inject]
    public required ClusterPingService pingService { get; set; }

    public ClusterPingService PingService { get => pingService; set => pingService = value; }

    protected override void OnInitialized()
    {
        clusters = ClusterOptions.Value
            .Select(opt => new ClusterInfoRow(opt.Alias))
            .ToArray();

        base.OnInitialized();
    }

    private async Task HandlePingServers()
    {
        await RunWithLoadingAsync(async () =>
        {
            var clusterOptions = ClusterOptions.Value.ToList();

            var pingTasks = clusterOptions
                .Select(opt => pingService.PingServerAsync(opt.Address))
                .ToList();
            var pingResults = await Task.WhenAll(pingTasks);

            for (int i = 0; i < clusterOptions.Count; i++)
            {
                var opt = clusterOptions[i];
                var cacheKey = opt.CacheKey();
                var (m, _) = pingResults[i];

                clusters[i].LastCheck = DateTime.Now;

                if (m is Metadata meta)
                {
                    clusters[i].ok = true;
                    MemoryCache.Set(cacheKey, meta, TimeSpan.FromMinutes(60)); // TODO: make configurable
                }
                else
                {
                    clusters[i].ok = false;
                    MemoryCache.Remove(cacheKey);
                }
            }
        });
    }
}
