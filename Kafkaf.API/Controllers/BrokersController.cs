using Confluent.Kafka.Admin;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{cluserIdx:clusterIndex}/brokers")]
[ApiController]
public class BrokersController : ControllerBase
{
	private readonly ClusterService _clusterService;
	private readonly BrokersService _brokersService;

	public BrokersController(ClusterService clusterService, BrokersService brokersService)
	{
		_clusterService = clusterService;
		_brokersService = brokersService;
	}

	[HttpGet]
	public async Task<BrokersInfoViewModel> GetListAsync(int cluserIdx)
	{
		var result = await _clusterService.DescribeClusterAsync(cluserIdx);

		return new BrokersInfoViewModel(result);
	}

	[HttpGet("{brokerId:int}")]
	public async Task<ActionResult<BrokerConfigRow[]>> BetConfigsAsync(int cluserIdx, int brokerId)
	{
		var result = await _brokersService.DescribeBrokerAsync(cluserIdx, brokerId);

		if (result is DescribeConfigsResult configs)
		{
			return Ok(BrokerConfigRow.FromResult(configs));
		}

		return NotFound($"Bad broker id?");
	}
}
