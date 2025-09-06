using Kafkaf.Web.Services;
using Kafkaf.Web.ViewModels;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;

namespace Kafkaf.Web.Components.Pages.Topics;

public partial class Index : ClusterIndexAwarePage
{
    [Inject]
    public required KafkaAdminService adminService { get; set; }

    [Inject]
    public required NavigationManager NavManager { get; set; }

    private List<string> SelectedTopics = new();
    private List<TopicsListViewModel> _topics = new();
    private List<TopicsListViewModel> Topics = new();

    private bool _showInternalTopics = false;
    private bool ShowInternalTopics
    {
        get => _showInternalTopics;
        set
        {
            _showInternalTopics = value;

            ApplyTopicFilters();
        }
    }

    private string? _searchTopicName = null;
    public string? SearchTopicName
    {
        get => _searchTopicName;
        set
        {
            _searchTopicName = value;
            ApplyTopicFilters();
        }
    }

    protected override async Task OnInitializedAsync()
    {
        await LoadTopics();

        ApplyTopicFilters();

        await base.OnInitializedAsync();
    }


    private void ApplyTopicFilters()
    {
        var qry = _topics.AsQueryable();

        if (!_showInternalTopics)
        {
            qry = qry.Where(topic => !topic.TopicName.StartsWith("__"));
        }

        if (!string.IsNullOrEmpty(_searchTopicName))
        {
            qry = qry.Where(topic => topic.TopicName.Contains(_searchTopicName, StringComparison.InvariantCultureIgnoreCase));
        }

        Topics = qry.ToList();
    }


    private void HandleTopicChecked(ChangeEventArgs e, string topicName)
    {
        if (e.Value is true)
        {
            SelectedTopics.Add(topicName);
        }
        else
        {
            SelectedTopics.Remove(topicName);
        }        
    }

    private async Task DeleteTopicsAsync()
    {
        var cfg = ClusterConfig;

        await RunWithLoadingAsync(async () =>
        {
            await adminService.DeleteTopicsAsync(cfg, SelectedTopics);
            await RefreshTopicsAsync(cfg.CacheKey());

            notice = "Topic(s) deleted!";
        });
    }

    private async Task PurgeMessagesAsync()
    {
        await RunWithLoadingAsync(async () =>
        {
            await adminService.PurgeMessagesAsync(ClusterConfig, SelectedTopics);

            notice = "Messages purged!";
            SelectedTopics.Clear();
            // RefreshTopicsAsync????
        });
    }

    private void HandleCopyTopics()
    {        
        if (SelectedTopics.Count() == 1 && 
            SelectedTopics.First() is string topicName && 
            _topics.FirstOrDefault(t => t.TopicName == topicName) is TopicsListViewModel topic)
        {
            var filterParams = new Dictionary<string, object>
            {
                ["TopicName"] = topic.TopicName,
                ["Size"] = topic.Size,
                ["ReplicationFactor"] = topic.ReplicationFactor,
                ["Partitions"] = topic.Partitions
            };            
            
            var newUri = NavManager.GetUriWithQueryParameters($"{NavManager.Uri}/create", filterParams!);

            NavManager.NavigateTo(newUri);
        }
    }

    private async Task LoadTopics()
    {
        var clusterConfig = ClusterConfig;
        var meta = await MemoryCache.GetOrCreateAsync(
            clusterConfig.CacheKey(),
            async cacheEntry =>
            {
                cacheEntry.SlidingExpiration = TimeSpan.FromMinutes(60);

                return await KafkaUtils.GetMetadata(clusterConfig);
            });

        var counts = KafkaUtils.CountMessages(clusterConfig, meta!.Topics);

        // TODO: handle null
        _topics = meta!.Topics
            .Select((meta, i) => 
            {
                return new TopicsListViewModel(meta)
                {
                    NumberOfMessages = (int)counts[i]
                };
            })
            .ToList();        
    }

    private async Task RefreshTopicsAsync(string cacheKey)
    {
        SelectedTopics.Clear();
        MemoryCache.Remove(cacheKey);
        await LoadTopics();
        ApplyTopicFilters();
    }
}
