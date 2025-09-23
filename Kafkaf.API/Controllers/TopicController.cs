using Confluent.Kafka.Admin;
using Kafkaf.API.Facades;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}")]
[ApiController]
public class TopicController : ControllerBase
{
	private readonly TopicDetailsFacade _servicesFacade;

	public TopicController(TopicDetailsFacade servicesFacade) => _servicesFacade = servicesFacade;

	[HttpGet]
	public async Task<ActionResult<string>> GetAsync(int clusterIdx, string topicName)
	{
		try
		{
			var topicConfigs = await _servicesFacade.GetTopicDetails(clusterIdx, topicName);
			return Ok(topicConfigs);
		}
		catch (DescribeTopicsException dte)
		{
			return NotFound(dte.Message);
		}
	}
}
