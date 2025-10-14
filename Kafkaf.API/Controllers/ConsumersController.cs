using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers
{
	[Route("api/clusters/{cluserIdx:clusterIndex}")]
	[ApiController]
	public class ConsumersController : ControllerBase
	{
		private readonly ConsumersService _consumersService;

		public ConsumersController(ConsumersService consumersService) =>
			_consumersService = consumersService;

		/// <summary>
		/// GET api/clusters/{clusterIdx}/consumers
		/// </summary>
		/// <param name="cluserIdx"></param>
		/// <returns></returns>
		[HttpGet("consumers")]
		public async Task<IEnumerable<ConsumerGroupRow>> GetAsync([FromRoute] int cluserIdx)
		{
			var groups = await _consumersService.GetConsumersAsync(cluserIdx);
			return ConsumerGroupRow.FromConsumerGroupDescription(groups);
		}

		/// <summary>
		/// GET api/clusters/{clusterIdx}/topics/{topicName}/consumers
		/// </summary>
		/// <param name="clusterIdx"></param>
		/// <param name="topicName"></param>
		/// <returns></returns>
		[HttpGet("topics/{topicName}/consumers")]
		public async Task<IEnumerable<TopicConsumersRow>> GetTopicConsumersAsync(
			int clusterIdx,
			string topicName
		)
		{
			var groups = await _consumersService.GetConsumersAsync(clusterIdx, topicName);
			return TopicConsumersRow.FromConsumerGroupDescription(groups);
		}
	}
}
