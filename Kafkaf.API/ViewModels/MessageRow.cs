using System.Text;
using System.Text.Json;
using Confluent.Kafka;

namespace Kafkaf.API.ViewModels;

public record MessageRow(
    long offset,
    int partition,
    Timestamp timestamp,
    string? key,
    string? value,
    string? headers
)
{
    public MessageRow(ConsumeResult<byte[]?, byte[]?> cr)
        : this(
            offset: cr.Offset.Value,
            partition: cr.Partition,
            timestamp: cr.Message.Timestamp,
            key: _str(cr.Message.Key),
            value: _str(cr.Message.Value),
            headers: string.Empty
        )
    {
        if (cr.Message.Headers?.Count > 0)
        {
            var headersDict = cr.Message.Headers.ToDictionary(
                h => h.Key,
                h => _str(h.GetValueBytes())
            );

            headers = JsonSerializer.Serialize(
                headersDict,
                new JsonSerializerOptions { WriteIndented = true }
            );
        }
    }

    public static MessageRow FromResult(ConsumeResult<byte[]?, byte[]?> result) =>
        new MessageRow(result);

    public static IEnumerable<MessageRow> FromResults(
        IEnumerable<ConsumeResult<byte[]?, byte[]?>> results
    ) => results.Select(FromResult);

    internal static string _str(byte[]? bytes) =>
        bytes is null ? string.Empty : Encoding.UTF8.GetString(bytes);
}
