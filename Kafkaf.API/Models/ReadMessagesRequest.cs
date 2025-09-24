using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Models;

public record ReadMessagesRequest(
	string Partitions,
	SeekType seekType = SeekType.OFFSET,
	SeekDirection seekDirection = SeekDirection.FORWARD,
	string? keySerde = null,
	string? valueSerde = null,
	int? Offset = null,
	DateTime? Timestamp = null
) : IValidatableObject
{
	public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
	{
		// No validation errors, so return an empty sequence.
		yield break;
	}

	public int[] PartitionsAsInt => Partitions.Split(',').Select(int.Parse).ToArray();
}
