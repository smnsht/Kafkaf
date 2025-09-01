using Confluent.Kafka;
using Kafkaf.Web;
using Kafkaf.Web.Components.UI;
using Microsoft.Extensions.Caching.Memory;

namespace Kafkaf.Web.Components.Pages.Brokers;

public partial class Index : ClusterIndexAwarePage
{
    public List<BrokerMetadata> brokers = new List<BrokerMetadata>();

    protected override async Task OnInitializedAsync()
    {
        var clusterConfig = ClusterOptions.Value[clusterIdx - 1];
        var meta = await MemoryCache.GetOrCreateAsync(
            clusterConfig.CacheKey(),
            async cacheEntry =>
            {
                cacheEntry.SlidingExpiration = TimeSpan.FromMinutes(60);

                return await KafkaUtils.GetMetadata(clusterConfig);
            });

        // TODO: handle null
        brokers = meta!.Brokers;

        await base.OnInitializedAsync();
    }
}
