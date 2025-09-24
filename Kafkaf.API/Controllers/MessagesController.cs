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
	public IEnumerable<ReadMessagesViewModel> GetMessages(
		int clusterIdx,
		string topicName,
		[FromQuery] ReadMessagesRequest req,
		CancellationToken ct
	)
	{
		var results = _readerService.ReadMessagesBackwards(clusterIdx, topicName, req, ct);

		return ReadMessagesViewModel.FromResults(results);
	}	
}
