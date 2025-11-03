using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}")]
[ApiController]
public class TopicController : ControllerBase
{
    [FromRoute(Name = "clusterIdx")]
    public int ClusterIdx { get; set; }

    [FromRoute(Name = "topicName")]
    public string TopicName { get; set; } = null!;

    /// <summary>
    /// GET api/clusters/{clusterIdx}/topics/{topicName}
    /// </summary>
    /// <param name="offsetsService"></param>
    /// <param name="topicsService"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult<TopicDetailsViewModel>> GetTopicDetailsAsync(
        [FromServices] IWatermarkOffsetsService offsetsService,
        [FromServices] ITopicsService topicsService
    )
    {
        var topicDescription = await topicsService.DescribeTopicsAsync(
            ClusterIdx,
            TopicName
        );

        var topicDetails = TopicDetailsViewModel.build(
            topicDescription,
            topics => offsetsService.GetWatermarkOffsets(ClusterIdx, TopicName, topics)
        );

        return Ok(topicDetails);
    }

    /// <summary>
    /// DELETE api/clusters/{clusterIdx}/topics/{topicName}
    /// </summary>
    /// <param name="topicsService"></param>
    /// <returns></returns>
    [HttpDelete]
    public async Task<ActionResult> DeleteTopicAsync(
        [FromServices] ITopicsService topicsService
    )
    {
        await topicsService.DeleteTopicAsync(ClusterIdx, TopicName);
        return Ok();
    }

    /// <summary>
    /// PUT api/clusters/{clusterIdx}/topics/{topicName}
    /// </summary>
    /// <param name="req"></param>
    /// <param name="topicsService"></param>
    /// <returns></returns>
    [HttpPut]
    public async Task<ActionResult> UpdateTopicAsync(
        UpdateTopicModel req,
        [FromServices] ITopicsService topicsService
    )
    {
        var topicDescription = await topicsService.DescribeTopicsAsync(
            ClusterIdx,
            TopicName
        );

        if (
            req.NumPartitions.HasValue
            && req.NumPartitions.Value <= topicDescription.Partitions.Count
        )
        {
            ModelState.AddModelError(
                nameof(req.NumPartitions),
                "NumPartitions must be greater than current partition count."
            );

            return ValidationProblem(ModelState);
        }

        await topicsService.UpdateTopicAsync(ClusterIdx, TopicName, req);

        return Ok();
    }

    /// <summary>
    /// POST api/clusters/{clusterIdx}/topics/{topicName}/recreate
    /// </summary>
    /// <param name="req"></param>
    /// <param name="topicsService"></param>
    /// <returns></returns>
    [HttpPost("recreate")]
    public async Task<ActionResult> RecreateTopicAsync(
        [FromBody] RecreateTopicModel req,
        [FromServices] ITopicsService topicsService
    )
    {
        await topicsService.RecreateAsync(ClusterIdx, TopicName, req);
        return Ok();
    }

    /// <summary>
    /// GET api/clusters/{clusterIdx}/topics/{topicName}/settings
    /// </summary>
    /// <param name="svc"></param>
    /// <returns></returns>
    [HttpGet("settings")]
    public async Task<ActionResult<TopicSettingRow[]>> GetSettingsAsync(
        [FromServices] ISettingsService svc
    ) => await svc.GetAsync(ClusterIdx, TopicName);

    /// <summary>
    /// PATCH api/clusters/{clusterIdx}/topics/{topicName}/settings/{name}
    /// </summary>
    /// <param name="name"></param>
    /// <param name="model"></param>
    /// <param name="svc"></param>
    /// <returns></returns>
    [HttpPatch("settings/{name}")]
    public async Task<ActionResult> PatchSettingsAsync(
        [FromRoute] string name,
        [FromBody] PatchSettingModel model,
        [FromServices] ISettingsService svc
    )
    {
        if (model.name != name)
        {
            ModelState.AddModelError(
                "name",
                $"Route parameter '{name}' must match model.name '{model.name}'."
            );
            return ValidationProblem(ModelState);
        }

        await svc.UpdatePartialAsync(ClusterIdx, TopicName, model);
        return NoContent();
    }    
}
