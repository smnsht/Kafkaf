using Confluent.Kafka;
using Kafkaf.API.Models;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/clusters/{clusterIdx:clusterIndex}/topics/{topicName:topicName}/messages")]
[ApiController]
public class MessagesController : ControllerBase
{
    /// <summary>
    /// GET api/clusters/{clusterIdx}/topics/{topicName}/messages
    /// </summary>
    /// <param name="clusterIdx"></param>
    /// <param name="topicName"></param>
    /// <param name="req"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    /// <exception cref="ArgumentOutOfRangeException"></exception>
    [HttpGet]
    public IEnumerable<MessageRow> GetMessages(
        [FromRoute] int clusterIdx,
        [FromRoute] string topicName,
        [FromQuery] ReadMessagesRequest req,
        [FromServices] IMessagesReaderService readerService,
        CancellationToken ct
    )
    {
        var args = new MessageReaderArgs(
            clusterIdx,
            topicName,
            req.PartitionsAsInt(),
            ct,
            Offset: req.Offset,
            Limit: req.Limit,
            Timestamp: req.Timestamp
        );
        // csharpier-ignore-start
		var results = (req.seekType, req.seekDirection) switch
        {
            (SeekType.LIMIT, SeekDirection.FORWARD) => readerService.ReadFromBeginning(args),
            (SeekType.LIMIT, SeekDirection.BACKWARD) => readerService.ReadFromEnd(args),
            (SeekType.OFFSET, SeekDirection.FORWARD) => readerService.ReadFromOffset(args),
            (SeekType.OFFSET, SeekDirection.BACKWARD) => readerService.ReadUntilOffset(args),
            (SeekType.TIMESTAMP, SeekDirection.FORWARD) => readerService.ReadFromTimestamp(args),
            (SeekType.TIMESTAMP, SeekDirection.BACKWARD) => readerService.ReadUntilTimestamp(args),
            _ => throw new ArgumentOutOfRangeException(nameof(req)),
        };
        // csharpier-ignore-end

        return MessageRow.FromResults(results);
    }

    /// <summary>
    /// POST api/clusters/{clusterIdx}/topics/{topicName}/messages
    /// </summary>
    /// <param name="clusterIdx"></param>
    /// <param name="topicName"></param>
    /// <param name="model"></param>
    /// <param name="pool"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult> CreateMessageAsync(
        [FromRoute] int clusterIdx,
        [FromRoute] string topicName,
        [FromBody] CreateMessageModel model,
        [FromServices] IMessagesWriterService writerService,
        CancellationToken cancellationToken
    )
    {
        var dr = await writerService.CreateMessageAsync(
            clusterIdx,
            topicName,
            model,
            cancellationToken
        );

        if (dr.Status == PersistenceStatus.NotPersisted)
        {
            return Problem("Message not persisted.");
        }

        return Ok(dr);
    }

    /// <summary>
    /// DELETE api/clusters/{clusterIdx}/topics/{topicName}/messages
    /// </summary>
    /// <param name="clusterIdx"></param>
    /// <param name="topicName"></param>
    /// <param name="topicsService"></param>
    /// <param name="messagesWriterService"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpDelete]
    public async Task<ActionResult<int>> PurgeMessagesAsync(
        [FromRoute] int clusterIdx,
        [FromRoute] string topicName,
        [FromQuery] int? partition,
        [FromServices] ITopicsService topicsService,
        [FromServices] IMessagesWriterService messagesWriterService
    )
    {
        var td = await topicsService.DescribeTopicsAsync(clusterIdx, topicName);
        var results = await messagesWriterService.TruncateMessagesAsync(
            clusterIdx,
            td,
            partition
        );

        return Ok(results.Count);
    }
}
