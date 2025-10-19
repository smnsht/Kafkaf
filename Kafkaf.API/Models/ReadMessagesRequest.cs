using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Models;

public record ReadMessagesRequest(
    string[] Partitions,
    [EnumDataType(typeof(SeekType))] SeekType seekType = SeekType.OFFSET,
    [EnumDataType(typeof(SeekDirection))]
        SeekDirection seekDirection = SeekDirection.FORWARD,
    [EnumDataType(typeof(SerdeTypes))] string? keySerde = null,
    [EnumDataType(typeof(SerdeTypes))] string? valueSerde = null,
    int? Offset = null,
    DateTime? Timestamp = null
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Partitions.Any(p => int.TryParse(p, out var _)))
        {
            yield return new ValidationResult(
                "Invalid numeric array.",
                [nameof(Partitions)]
            );
        }

        yield break;
    }

    public int[] PartitionsAsInt() => Partitions.Select(int.Parse).Distinct().ToArray();
}
