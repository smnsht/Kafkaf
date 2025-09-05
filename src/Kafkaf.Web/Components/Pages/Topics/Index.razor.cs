using Kafkaf.Web.Services;
using Kafkaf.Web.ViewModels;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;

namespace Kafkaf.Web.Components.Pages.Topics;

public partial class Index : ClusterIndexAwarePage
{
    [Inject]
    public required KafkaAdminService adminService { get; set; }

    private List<string> SelectedTopics = new();
    private List<TopicsListViewModel> _topics = new();
    private List<TopicsListViewModel> Topics = new();

    private bool _showInternalTopics = true;
    private bool ShowInternalTopics
    {
        get => _showInternalTopics;
        set
        {
            _showInternalTopics = value;

            UpdateTopics();
        }
    }

    private string? _searchTopicName = null;
    public string? SearchTopicName
    {
        get => _searchTopicName;
        set
        {
            _searchTopicName = value;
            UpdateTopics();
        }
    }

    //private string? _errorNotice;
    //private string? _successNotice;


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
        _topics = meta!.Topics
            .Select(meta => new TopicsListViewModel(meta))
            .ToList();

        UpdateTopics();

        await base.OnInitializedAsync();
    }


    private void UpdateTopics()
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
        await RunWithLoadingAsync(async () =>
        {
            await adminService.DeleteTopicsAsync(ClusterConfig, SelectedTopics);

            notice = "Topic(s) deleted!";
            SelectedTopics.Clear();
        });
    }

    private async Task PurgeMessagesAsync()
    {
        await RunWithLoadingAsync(async () =>
        {
            await adminService.PurgeMessagesAsync(ClusterConfig, SelectedTopics);

            notice = "Messages purged!";
            SelectedTopics.Clear();
        });
    }


    private void HandleCopyTopics()
    {
        // TODO
    }

    //private async Task WithLoadingAsync(WithClusterConfigAndTopicsAsyncDelegate del)
    //{
    //    var clusterConfig = ClusterOptions.Value[clusterIdx - 1];

    //    _errorNotice = null;
    //    _successNotice = null;
    //    loading = true;
    //    try
    //    {
    //        await del(clusterConfig, SelectedTopics);

    //        _successNotice = "Sucess";
    //    }
    //    catch (Exception e)
    //    {
    //        _errorNotice = e.Message;
    //    }
    //    finally
    //    {
    //        loading = false;
    //    }
    //}

}
