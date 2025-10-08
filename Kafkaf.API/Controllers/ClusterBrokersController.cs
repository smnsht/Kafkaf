using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{cluserIdx:clusterIndex}/brokers")]
[ApiController]
public class ClusterBrokersController : ControllerBase
{
	private readonly ClusterService _clusterService;

	public ClusterBrokersController(ClusterService clusterService) => _clusterService = clusterService;

	[HttpGet]
	public async Task<BrokerInfoRow[]> GetListAsync(int cluserIdx)
	{
		var result = await _clusterService.DescribeClusterAsync(cluserIdx);
		return BrokerInfoRow.FromResult(result);
	}
}
