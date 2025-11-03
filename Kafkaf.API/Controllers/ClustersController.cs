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
    public async Task<IEnumerable<ClusterInfoViewModel>> GetClustersAsync(
        [FromServices] IClusterService clusterService,
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
        [FromServices] IClusterService clusterService
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
        [FromServices] IClusterService clusterService,
        CancellationToken ct
    )
    {
        var alias = clusterService.ClusterConfigOptions()[cluserIdx].Alias;

        return await clusterService.FetchClusterInfoAsync(alias, ct);
    }

    /// <summary>
    /// GET api/clusters/{clusterIdx}/consumers"
    /// </summary>
    /// <param name="clusterIdx"></param>
    /// <param name="builder"></param>
    /// <returns></returns>
    [HttpGet("{clusterIdx:clusterIndex}/consumers")]
    public async Task<IEnumerable<ConsumerGroupRow>> GetConsumersAsync(
        [FromRoute] int clusterIdx,
        [FromServices] IConsumersService consumersService,
        [FromServices] IWatermarkOffsetsService watermarksService,
        CancellationToken ct
    )
    {
        var groups = await consumersService.GetConsumersAsync(clusterIdx, ct);

        var allPartitions = groups.SelectMany(g => g.Offsets.Keys).Distinct().ToList();

        var watermarkResults = watermarksService.GetWatermarkOffsets(
            clusterIdx,
            allPartitions
        );

        return groups
            .Select(g => ConsumerGroupRow.FromConsumerGroupInfo(g, watermarkResults))
            .Where(r => r != null)!;
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
        [FromServices] IClusterService clusterService
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
        [FromServices] IBrokersService brokersService
    )
    {
        var result = await brokersService.DescribeBrokerAsync(cluserIdx, brokerId);
        return BrokerConfigRow.FromResult(result);
    }
}
