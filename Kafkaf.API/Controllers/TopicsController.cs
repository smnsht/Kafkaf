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

    public TopicsController(TopicsService topicsService) =>
        _topicsService = topicsService;

    /// <summary>
    /// GET api/clusters/{cluserIdx}/topics/configs
    /// TODO: move elsewere, does not belongs to specific cluster
    /// </summary>
    /// <returns></returns>
    [HttpGet("configs")]
    public TopicConfigRow[] GetConfigs() => TopicConfigRow.FromDefault();

    /// <summary>
    /// GET api/clusters/{cluserIdx}/topics
    /// </summary>
    /// <param name="clusterNo"></param>
    /// <param name="svc"></param>
    /// <returns></returns>
    [HttpGet]
    public IEnumerable<TopicsListViewModel> GetTopics([FromRoute] int clusterNo)
    {
        var topics = _topicsService.GetAllTopicsMetadata(clusterNo);

        return TopicsListViewModel.FromMetadata(topics);
    }

    /// <summary>
    /// POST api/clusters/{cluserIdx}/topics
    /// </summary>
    /// <param name="clusterIdx"></param>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult> CreateAsync(
        [FromRoute] int clusterIdx,
        [FromBody] CreateTopicModel req
    )
    {
        await _topicsService.CreateTopicsAsync(clusterIdx, req.ToTopicSpecification());
        return Created();
    }

    /// <summary>
    /// DELETE api/clusters/{cluserIdx}/topics
    /// </summary>
    /// <param name="clusterIdx"></param>
    /// <param name="req"></param>
    /// <returns></returns>
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
