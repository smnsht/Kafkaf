using System.Text;
using Confluent.Kafka;

namespace Kafkaf.API.Models;

public record CreateMessageModel(
    int? Partition,
    string? key,
    string? value,
    Dictionary<string, string>? headers
)
{
    public byte[]? KeyBytes =>
        string.IsNullOrEmpty(key) ? null : Encoding.UTF8.GetBytes(key);
    public byte[]? ValueBytes =>
        string.IsNullOrEmpty(value) ? null : Encoding.UTF8.GetBytes(value);
    public Headers MessageHeaders =>
        headers == null
            ? new Headers()
            : headers.Aggregate(
                new Headers(),
                (h, pair) =>
                {
                    h.Add(pair.Key, Encoding.UTF8.GetBytes(pair.Value));
                    return h;
                }
            );
}
