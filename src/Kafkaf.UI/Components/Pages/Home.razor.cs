using Confluent.Kafka;
using Kafkaf.UI.Config;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Kafkaf.UI.Components.Pages;

public record ClusterInfoRow(
        string ClusterName,
        string Version = "",
        int BrokersCount = 0,
        int PartitionsCount = 0,
        int TopicsCount = 0,
        int Production = 0,
        int Consumption = 0);

public record OfflineCluster(string alias, string address);

public partial class Home : ComponentBase
{
    [Inject]
    public required IOptions<List<ClusterConfigOptions>> ClusterOptions { get; set; }

    [Inject]
    public required IMemoryCache MemoryCache { get; set; }

    public bool loading = false;
    public List<OfflineCluster> offlineClusters = new List<OfflineCluster>();
    public List<ClusterInfoRow> onlineClusters = new List<ClusterInfoRow>();

    protected override async Task OnInitializedAsync()
    {
        loading = true;

        var tasks = ClusterOptions.Value.Select(opt =>
        {
            var config = new AdminClientConfig
            {
                BootstrapServers = opt.Address,
            };

            return Task.Run(() =>
            {
                try
                {
                    using var adminClient = new AdminClientBuilder(config).Build();

                    var meta = adminClient.GetMetadata(TimeSpan.FromSeconds(3));
                    var infoRow = new ClusterInfoRow(
                        ClusterName: opt.Alias,
                        BrokersCount: meta.Brokers.Count,
                        TopicsCount: meta.Topics.Count);

                    onlineClusters.Add(infoRow);
                }
                catch (KafkaException ex)
                {
                    Console.WriteLine(ex.StackTrace);
                    offlineClusters.Add(new OfflineCluster(alias: opt.Alias, address: opt.Address));
                }
            });
        });

        if (tasks?.Count() > 0) 
        {             
            await Task.WhenAll(tasks);
        }

        await base.OnInitializedAsync();

        loading = false;
    }
}
