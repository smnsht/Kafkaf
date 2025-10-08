using Confluent.Kafka.Admin;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}")]
[ApiController]
public class TopicController : ControllerBase
{
	private readonly TopicsService _topicsService;
	private readonly WatermarkOffsetsService _consumerService;

	public TopicController(
		TopicsService topicsService,
		WatermarkOffsetsService watermarkOffsetsService
	)
	{
		_topicsService = topicsService;
		_consumerService = watermarkOffsetsService;
	}

	/// <summary>
	/// GET api/clusters/{clusterIdx}/topics/{topicName}
	/// </summary>
	/// <param name="clusterIdx"></param>
	/// <param name="topicName"></param>
	/// <returns></returns>
	[HttpGet]
	public async Task<ActionResult<TopicDetailsViewModel>> GetTopicDetailsAsync(
		int clusterIdx,
		string topicName
	)
	{
		DescribeTopicsResult topicResult = default!;
		try
		{
			// Will throw DescribeTopicsException when topic not found
			topicResult = await _topicsService.DescribeTopicsAsync(clusterIdx, topicName);
		}
		catch (DescribeTopicsException dte)
		{
			return NotFound(dte.Message);
		}

		var desc =
			topicResult.TopicDescriptions.FirstOrDefault()
			?? throw new InvalidOperationException(
				$"Topic '{topicName}' was not found in cluster {clusterIdx}."
			);

		var partitionOffsets = _consumerService.GetWatermarkOffsets(
			clusterIdx,
			topicName,
			desc.Partitions.Select(p => p.Partition).ToArray()
		);

		var topicDetails = new TopicDetailsViewModel(desc, partitionOffsets);

		return Ok(topicDetails);
	}

	[HttpGet("settings")]
	public async Task<ActionResult<TopicSettingRow[]>> GetTopicSettingsAsync(
		int clusterIdx,
		string topicName
	)
	{
		var topicConfig = await _topicsService.DescribeTopicConfigsAsync(clusterIdx, topicName);

		if (topicConfig is DescribeConfigsResult configs)
		{
			return Ok(TopicSettingRow.FromResult(configs));
		}

		return NotFound($"Can't get configs for topic");
	}

	[HttpGet("consumers")]
	public async Task<ActionResult<ConsumerGroupListing[]>> GetTopicConsumersAsync(
		int clusterIdx,
		string topicName
	)
	{
		var consumerGroups = await _topicsService.GetTopicConsumersAsync(clusterIdx, topicName);
		return Ok(consumerGroups.Select(ConsumerGroupRow.FromConsumerGroupListing));
	}

	/// <summary>
	/// DELETE api/clusters/{clusterIdx}/topics/{topicName}
	/// </summary>
	/// <param name="clusterIdx"></param>
	/// <param name="topicName"></param>
	/// <returns></returns>
	[HttpDelete]
	public async Task<ActionResult> DeleteAsync(int clusterIdx, string topicName)
	{
		try
		{
			//await _topicsService.DeleteTopicAsync(clusterIdx, topicName);
			await Task.Delay(10);
			return Ok();
		}
		catch (DeleteTopicsException dte) when (dte.Message.Contains("Unknown topic or partition"))
		{
			return NotFound(dte.Message);
		}
		catch (Exception e)
		{
			return Problem(e.Message);
		}
	}
}
