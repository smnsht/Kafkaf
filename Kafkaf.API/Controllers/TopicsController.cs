using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{cluserIdx:clusterIndex}/topics")]
[ApiController]
public class TopicsController : ControllerBase
{
	private readonly ClusterService _clusterService;
	private readonly TopicsService _topicsService;

	public TopicsController(ClusterService clusterService, TopicsService topicsService)
	{
		_clusterService = clusterService;
		_topicsService = topicsService;
	}

	[HttpGet]
	public IEnumerable<TopicsListViewModel> GetTopics(int clusterNo)
	{
		// Request metadata for all topics in the cluster
		var metadata = _clusterService.GetMetadata(clusterNo);

		return metadata.Topics.Select(topicMeta => new TopicsListViewModel(topicMeta));
	}

	[HttpPost]
	public async Task<ActionResult> CreateAsync(int clusterIdx, CreateTopicModel req)
	{
		await _topicsService.CreateTopicsAsync(clusterIdx, req.ToTopicSpecification());
		return Created();
	}

	[HttpDelete]
	public async Task<BatchActionResult> DeleteAsync(
		int clusterIdx,
		[FromQuery] DeleteTopicsRequest req
	)
	{
		//var deleteResult = await _topicsService.DeleteTopicsAsync(clusterIdx, req.names);

		//return new BatchActionResult(deleteResult, null);
		await Task.Delay(10);
		var foo = req.names.Select(name => new BatchItemResult(name, true));
		return new BatchActionResult(foo, "asdfasd");
	}
}
