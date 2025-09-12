using System.Text;
using Confluent.Kafka;
using Kafkaf.Web.ViewModels;

namespace Kafkaf.Web.Mappers;

public class MessageMapper
{
	public static MessageViewModel<string, string>? TryMapMessage(ConsumeResult<byte[]?, byte[]?> cr)
	{
		if (cr is ConsumeResult<byte[]?, byte[]?> result && cr.Message is Message<byte[]?, byte[]?> msg)
		{			
			return new MessageViewModel<string, string>()
			{
				Key = GetStringFromBytes(msg.Key),
				Value = GetStringFromBytes(msg.Value),
				Offset = (ulong)result.Offset.Value,
				Partition = (uint)result.Partition.Value,
				Timestamp = msg.Timestamp.UtcDateTime
			};			
		}
		
		return null;
	}
	private static string GetStringFromBytes(byte[]? arr) =>
		arr is byte[] bytes ? Encoding.UTF8.GetString(bytes) : string.Empty;
}
