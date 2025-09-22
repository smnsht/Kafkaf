using Kafkaf.API.Facades;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{cluserIdx:clusterIndex}/[controller]")]
[ApiController]
public class TopicsController : ControllerBase
{
	[HttpGet]
	public IEnumerable<TopicsListViewModel> GetTopics(int clusterNo, [FromServices] ClusterService clusterService)
	{
		// Request metadata for all topics in the cluster
		var metadata = clusterService.GetMetadata(clusterNo);

		return metadata.Topics.Select(topicMeta => new TopicsListViewModel(topicMeta));
	}

	[HttpGet("{topicName:alpha}")]
	public async Task<ActionResult<TopicDetailsViewModel>> GetTopicDetails(int clusterNo, string topicName, [FromServices] TopicDetailsFacade detailsService)
	{
		try
		{
			var details = await detailsService.GetTopicDetails(clusterNo, topicName); 
			return Ok(details);
		}
		catch (Exception)
		{			
			return NotFound();
		}
	}
}
