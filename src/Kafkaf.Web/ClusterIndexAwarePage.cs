using Kafkaf.Web.Config;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Kafkaf.Web;

public class ClusterIndexAwarePage : ComponentBase
{
    [Parameter]
    public int clusterIdx { get; set; }

    [Inject]
    public required IOptions<List<ClusterConfigOptions>> ClusterOptions { get; set; }

    [Inject]
    public required IMemoryCache MemoryCache { get; set; }

    public bool loading = false;
    public Exception? error = null;
    public string? notice;

    protected ClusterConfigOptions ClusterConfig
    {
        get => ClusterOptions.Value[clusterIdx - 1];
    }

    public async Task<bool> RunWithLoadingAsync(Func<Task> action, bool rethrow = false)
    {
        loading = true;
        error = null;
        notice = null;

        try
        {
            await action();
            return true;
        }
        catch (Exception e)
        {
            error = e;

            if (rethrow)
            {
                throw;
            }

            return false;
        }
        finally
        {
            loading = false;
        }
    }
}
