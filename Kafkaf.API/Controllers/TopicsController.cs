using Confluent.Kafka.Admin;
using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{cluserIdx:clusterIndex}/topics")]
[ApiController]
public class TopicsController : ControllerBase
{
	private readonly TopicsService _topicsService;

	public TopicsController(TopicsService topicsService) => _topicsService = topicsService;

	[HttpGet]
	public IEnumerable<TopicsListViewModel> GetTopics(
		[FromRoute] int clusterNo,
		[FromServices] ClusterService svc
	)
	{
		// Request metadata for all topics in the cluster
		var metadata = svc.GetMetadata(clusterNo);

		return metadata.Topics.Select(topicMeta => new TopicsListViewModel(topicMeta));
	}

	[HttpGet("configs")]
	public TopicConfigRow[] GetConfigs() => TopicConfigRow.FromDefault();

	[HttpPost]
	public async Task<ActionResult> CreateAsync([FromRoute] int clusterIdx, CreateTopicModel req)
	{
		try
		{
			await _topicsService.CreateTopicsAsync(clusterIdx, req.ToTopicSpecification());
			return Created();
		}
		catch (CreateTopicsException ex)
		{
			return Problem(ex.Results[0].Error.Reason);
		}
	}

	[HttpDelete]
	public async Task<BatchActionResult> DeleteAsync(
		[FromRoute] int clusterIdx,
		[FromQuery] DeleteTopicsRequest req
	)
	{
		var deleteResult = await _topicsService.DeleteTopicsAsync(clusterIdx, req.names);

		return new BatchActionResult(deleteResult, null);
	}
}
