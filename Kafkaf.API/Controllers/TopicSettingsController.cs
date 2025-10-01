using Confluent.Kafka.Admin;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers
{
	[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}/settings")]
	[ApiController]
	public class TopicSettingsController : ControllerBase
	{
		[HttpGet]
		public async Task<ActionResult<TopicSettingRow[]>> GetSettingsAsync(
			int clusterIdx,
			string topicName,
			TopicsService svc
		)
		{
			var topicConfig = await svc.DescribeTopicConfigsAsync(clusterIdx, topicName);

			if (topicConfig is DescribeConfigsResult configs)
			{
				return Ok(TopicSettingRow.FromResult(configs));
			}

			return NotFound($"Can't get configs for topic");			
		}
	}
}
