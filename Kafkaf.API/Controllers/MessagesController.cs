using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}/messages")]
[ApiController]
public class MessagesController : ControllerBase
{
	private readonly MessagesReaderService _readerService;

	public MessagesController(MessagesReaderService readerService) =>
		_readerService = readerService;

	[HttpGet]
	public IEnumerable<MessageRow> GetMessages(
		int clusterIdx,
		string topicName,
		[FromQuery] ReadMessagesRequest req,
		CancellationToken ct
	)
	{
		var results = req.seekDirection switch
		{
			SeekDirection.FORWARD => _readerService.ReadMessages(clusterIdx, topicName, req, ct),
			SeekDirection.BACKWARD => _readerService.ReadMessagesBackwards(clusterIdx, topicName, req, ct),
			SeekDirection.TAILING => throw new NotImplementedException(),
			_ => throw new ArgumentOutOfRangeException(nameof(req))
		};	

		return results.Select(MessageRow.FromResult);
	}

	[HttpDelete]
	public async Task<ActionResult<int>> PurgeMessagesAsync(
		int clusterIdx,
		string topicName,
		CancellationToken ct
	)
	{
		// TODO
		await Task.Delay(10);

		return Ok(0);
	}
}
