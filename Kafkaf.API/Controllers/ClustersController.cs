using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClustersController : ControllerBase
{
	private readonly ClusterService _clusterService;

	public ClustersController(ClusterService clusterService) => _clusterService = clusterService;

	[HttpGet]
	public async Task<IEnumerable<ClusterInfoViewModel>> Get(CancellationToken ct)
	{
		var tasks = _clusterService.ClusterConfigOptions.Select(cfg =>
			_clusterService.FetchClusterInfoAsync(cfg.Alias, ct)
		);

		return await Task.WhenAll(tasks);
	}

	[HttpGet("{cluserIdx:clusterIndex}")]
	public async Task<ClusterInfoViewModel> GetCluster(int cluserIdx, CancellationToken ct)
	{
		var alias = _clusterService.ClusterConfigOptions[cluserIdx].Alias;

		return await _clusterService.FetchClusterInfoAsync(alias, ct);
	}

	[HttpGet("configs")]
	public IEnumerable<ClusterConfigViewModel> GetConfigs() =>
		_clusterService.ClusterConfigOptions.Select(opt => new ClusterConfigViewModel(opt));
}
