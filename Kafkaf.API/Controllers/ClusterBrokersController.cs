using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

// Controller for cluster-level broker list/info
[Route("api/clusters/{cluserIdx:clusterIndex}/brokers")]
[ApiController]
public class ClusterBrokersController : ControllerBase
{
	private readonly ClusterService _clusterService;

	public ClusterBrokersController(ClusterService clusterService) => _clusterService = clusterService;

	[HttpGet]
	public async Task<BrokersInfoViewModel> GetListAsync(int cluserIdx)
	{
		var result = await _clusterService.DescribeClusterAsync(cluserIdx);
		return new BrokersInfoViewModel(result);
	}
}
