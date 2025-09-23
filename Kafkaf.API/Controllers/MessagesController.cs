using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;


[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}/messages")]
[ApiController]
public class MessagesController : ControllerBase
{
	private readonly MessagesReaderService _readerService;

	public MessagesController(MessagesReaderService readerService) => _readerService = readerService;

	//[HttpGet]
	//public ActionResult<string> GetMessages([FromRoute] ReadMessagesRequest2 req, CancellationToken ct)
	//{
	//	var str = req.ToString();
	//	return str;
	//}

	[HttpGet]
	public ActionResult<object> GetMessages(int clusterIdx, string topicName, [FromQuery] ReadMessagesRequest req, CancellationToken ct)
	{
		var something = _readerService.ReadMessages(clusterIdx, topicName, req, ct);
		var res = $"{clusterIdx} - {topicName}, {req}";
		return something.ToList();
	}
}
