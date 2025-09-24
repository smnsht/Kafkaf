using System.Text;
using System.Text.Json;
using Confluent.Kafka;

namespace Kafkaf.API.ViewModels;

public record ReadMessagesViewModel(
	long offset,
	int partition,
	Timestamp timestamp,
	string? key,
	string? value,
	string? headers
)
{
	public ReadMessagesViewModel(ConsumeResult<byte[]?, byte[]?> cr)
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
			var headersDict = cr.Message.Headers
				.ToDictionary(
					h => h.Key,
					h => _str(h.GetValueBytes())						
				);
			
			headers = JsonSerializer.Serialize(headersDict, new JsonSerializerOptions
			{
				WriteIndented = true
			});
		}
	}

	public static IEnumerable<ReadMessagesViewModel> FromResults(List<ConsumeResult<byte[]?, byte[]?>> results) =>
		results.Select(result => new ReadMessagesViewModel(result));

	internal static string _str(byte[]? bytes) =>
		bytes is null ? string.Empty : Encoding.UTF8.GetString(bytes);
}
