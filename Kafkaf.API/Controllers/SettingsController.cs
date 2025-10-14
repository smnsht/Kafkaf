using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers
{
	[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}/settings")]
	[ApiController]
	public class SettingsController : ControllerBase
	{
		private readonly SettingsService _settingsService;

		[FromRoute(Name = "clusterIdx")]
		public int ClusterIdx { get; set; }

		[FromRoute(Name = "topicName")]
		public string TopicName { get; set; } = string.Empty;

		private ClusterTopic ClusterTopic => new ClusterTopic(ClusterIdx, TopicName);

		public SettingsController(SettingsService settingsService) =>
			_settingsService = settingsService;

		[HttpGet]
		public async Task<ActionResult<TopicSettingRow[]>> GetAsync() =>
			await _settingsService.GetAsync(ClusterTopic);

		[HttpPatch("{setting}")]
		public async Task<ActionResult> PatchAsync(string setting, PatchSettingModel model)
		{
			if (model.name != setting)
			{
				ModelState.AddModelError(
					"name",
					$"Route parameter '{setting}' must match model.name '{model.name}'."
				);
				return ValidationProblem(ModelState);
			}

			await _settingsService.UpdatePartialAsync(ClusterTopic, model);
			return NoContent();
		}
	}
}
