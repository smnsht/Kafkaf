using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters")]
[ApiController]
public class ClustersController : ControllerBase
{
    /// <summary>
    /// GET api/clusters
    /// </summary>
    /// <param name="clusterService"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<IEnumerable<ClusterInfoViewModel>> Get(
        [FromServices] ClusterService clusterService,
        CancellationToken ct
    )
    {
        var tasks = clusterService
            .ClusterConfigOptions()
            .Select(cfg => clusterService.FetchClusterInfoAsync(cfg.Alias, ct));

        return await Task.WhenAll(tasks);
    }

    /// <summary>
    /// GET api/clusters/configs
    /// </summary>
    /// <param name="clusterService"></param>
    /// <returns></returns>
    [HttpGet("configs")]
    public IEnumerable<ClusterConfigViewModel> GetConfigs(
        [FromServices] ClusterService clusterService
    ) =>
        clusterService
            .ClusterConfigOptions()
            .Select(opt => new ClusterConfigViewModel(opt));

    /// <summary>
    /// GET api/clusters/{clusterIdx}
    /// </summary>
    /// <param name="cluserIdx"></param>
    /// <param name="clusterService"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet("{cluserIdx}")]
    public async Task<ClusterInfoViewModel> GetCluster(
        [FromRoute] int cluserIdx,
        [FromServices] ClusterService clusterService,
        CancellationToken ct
    )
    {
        var alias = clusterService.ClusterConfigOptions()[cluserIdx].Alias;

        return await clusterService.FetchClusterInfoAsync(alias, ct);
    }

    /// <summary>
    /// GET api/clusters/{cluserIdx}/consumers"
    /// </summary>
    /// <param name="cluserIdx"></param>
    /// <param name="consumersService"></param>
    /// <returns></returns>
    [HttpGet("{cluserIdx:clusterIndex}/consumers")]
    public async Task<IEnumerable<ConsumerGroupRow>> GetAsync(
        [FromRoute] int cluserIdx,
        [FromServices] ConsumersService consumersService
    )
    {
        var groups = await consumersService.GetConsumersAsync(cluserIdx);
        return ConsumerGroupRow.FromConsumerGroupDescription(groups);
    }

    /// <summary>
    /// GET api/clusters/{cluserIdx}/brokers
    /// </summary>
    /// <param name="cluserIdx"></param>
    /// <param name="clusterService"></param>
    /// <returns></returns>
    [HttpGet("{cluserIdx:clusterIndex}/brokers")]
    public async Task<BrokerInfoRow[]> GetBrokersAsync(
        [FromRoute] int cluserIdx,
        [FromServices] ClusterService clusterService
    )
    {
        var result = await clusterService.DescribeClusterAsync(cluserIdx);
        return BrokerInfoRow.FromResult(result);
    }

    /// <summary>
    /// GET api/clusters/{cluserIdx}/brokers/{brokerId}
    /// </summary>
    /// <param name="cluserIdx"></param>
    /// <param name="brokerId"></param>
    /// <param name="brokersService"></param>
    /// <returns></returns>
    [HttpGet("{cluserIdx:clusterIndex}/brokers/{brokerId:int}")]
    public async Task<BrokerConfigRow[]> GetBrokerConfigsAsync(
        [FromRoute] int cluserIdx,
        [FromRoute] int brokerId,
        [FromServices] BrokersService brokersService
    )
    {
        var result = await brokersService.DescribeBrokerAsync(cluserIdx, brokerId);
        return BrokerConfigRow.FromResult(result);
    }
}
