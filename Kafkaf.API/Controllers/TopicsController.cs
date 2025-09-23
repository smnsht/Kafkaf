using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;


[Route("api/clusters/{cluserIdx:clusterIndex}/topics")]
[ApiController]
public class TopicsController : ControllerBase
{
	private readonly ClusterService _clusterService;

	public TopicsController(ClusterService clusterService) => _clusterService = clusterService;

	[HttpGet]
	public IEnumerable<TopicsListViewModel> GetTopics(int clusterNo)
	{
		// Request metadata for all topics in the cluster
		var metadata = _clusterService.GetMetadata(clusterNo);

		return metadata.Topics.Select(topicMeta => new TopicsListViewModel(topicMeta));
	}	
}
