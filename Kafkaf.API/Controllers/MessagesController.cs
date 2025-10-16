using Confluent.Kafka;
using Kafkaf.API.ClientPools;
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
        CancellationToken ct
    )
    {
        var results = req.seekDirection switch
        {
            SeekDirection.FORWARD => _readerService.ReadMessages(
                clusterIdx,
                topicName,
                req,
                ct
            ),
            SeekDirection.BACKWARD => _readerService.ReadMessagesBackwards(
                clusterIdx,
                topicName,
                req,
                ct
            ),
            SeekDirection.TAILING => throw new NotImplementedException(),
            _ => throw new ArgumentOutOfRangeException(nameof(req)),
        };

        return results.Select(MessageRow.FromResult);
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
        [FromServices] ProducersPool pool,
        CancellationToken cancellationToken
    )
    {
        var producer = pool.GetClient(clusterIdx);

        var dr = await producer.ProduceAsync(
            topicName,
            new Message<byte[]?, byte[]?>
            {
                Key = model.KeyBytes,
                Value = model.ValueBytes,
                Headers = model.MessageHeaders,
            },
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
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpDelete]
    public async Task<ActionResult<int>> PurgeMessagesAsync(
        [FromRoute] int clusterIdx,
        [FromRoute] string topicName,
        CancellationToken ct
    )
    {
        // TODO
        await Task.Delay(10);

        return Ok(0);
    }
}
