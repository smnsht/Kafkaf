using Confluent.Kafka;
using Confluent.Kafka.Admin;
using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}")]
[ApiController]
public partial class TopicController : ControllerBase
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
		try
		{
			// Will throw DescribeTopicsException when topic not found
			var topicResult = await _topicsService.DescribeTopicsAsync(clusterIdx, topicName);

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
		catch (DescribeTopicsException dte)
		{
			return NotFound(dte.Message);
		}
		catch (KafkaException kte)
		{
			return Problem(kte.Error.Reason);
		}
	}

	/// <summary>
	/// GET api/clusters/{clusterIdx}/topics/{topicName}/consumers
	/// </summary>
	/// <param name="clusterIdx"></param>
	/// <param name="topicName"></param>
	/// <returns></returns>
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
			await _topicsService.DeleteTopicAsync(clusterIdx, topicName);
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

	[HttpPost("recreate")]
	public async Task<ActionResult> RecreateAsync(
		int clusterIdx,
		string topicName,
		[FromBody] RecreateTopicModel req
	)
	{
		var topicConfig = await _topicsService.DescribeTopicConfigsAsync(clusterIdx, topicName);

		if (topicConfig is DescribeConfigsResult describeConfigsResult)
		{
			await _topicsService.DeleteTopicAsync(clusterIdx, topicName);

			var configs = describeConfigsResult
				.Entries.Where(e => e.Value != null && !e.Value.IsDefault)
				.ToDictionary(e => e.Key, e => e.Value.Value);

			var topicSpec = new TopicSpecification()
			{
				Name = topicName,
				NumPartitions = req.numPartitions,
				ReplicationFactor = req.replicationFactor,
				Configs = configs,
			};

			await _topicsService.CreateTopicsAsync(clusterIdx, topicSpec);

			return Ok();
		}

		return NotFound($"Can't get configs for topic");
	}

	[HttpPut]
	public async Task<ActionResult> UpdateAsync(
		int clusterIdx,
		string topicName,
		UpdateTopicModel req
	)
	{
		// Will throw DescribeTopicsException when topic not found
		var topicResult = await _topicsService.DescribeTopicsAsync(clusterIdx, topicName);

		var desc =
			topicResult.TopicDescriptions.FirstOrDefault()
			?? throw new InvalidOperationException(
				$"Topic '{topicName}' was not found in cluster {clusterIdx}."
			);

		if (req.NumPartitions.HasValue && req.NumPartitions.Value <= desc.Partitions.Count)
		{
			ModelState.AddModelError(
				nameof(req.NumPartitions),
				"NumPartitions must be greater than current partition count."
			);

			return ValidationProblem(ModelState);
		}

		await _topicsService.UpdateTopicAsync(clusterIdx, topicName, req);

		return Ok();
	}
}
