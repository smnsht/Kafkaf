using Confluent.Kafka.Admin;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{cluserIdx:clusterIndex}/brokers/{brokerId:int}")]
[ApiController]
public class BrokerConfigsController : ControllerBase
{
	private readonly BrokersService _brokersService;

	public BrokerConfigsController(BrokersService brokersService) =>
		_brokersService = brokersService;

	[HttpGet]
	public async Task<ActionResult<BrokerConfigRow[]>> GetConfigsAsync(int cluserIdx, int brokerId)
	{
		var result = await _brokersService.DescribeBrokerAsync(cluserIdx, brokerId);

		if (result is DescribeConfigsResult configs)
		{
			return Ok(BrokerConfigRow.FromResult(configs));
		}

		return NotFound($"Bad broker id?");
	}
}
