using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Models;
//int cluserIdx,
//string Topic,
public record ReadMessagesRequest(
	string Partitions,
	SeekType seekType=SeekType.OFFSET,
	SeekDirection seekDirection=SeekDirection.FORWARD,
	string? keySerde=null,
	string? valueSerde = null,
	int ? Offset=null,
	DateTime ? Timestamp=null
) : IValidatableObject
{
	public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
	{
		// No validation errors, so return an empty sequence.
		yield break;
	}
}


public record ReadMessagesRequest2(int clusterIdx, string topicName);
public record ReadMessagesRequest3(
	SeekType? seekType,
	SeekDirection? seekDirection,
	int[]? Partitions,
	string? keySerde,
	string? valueSerde,
	int? Offset,
	DateTime? Timestamp
);

