using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Models;

public record ReadMessagesRequest(
    string[] Partitions,
    [EnumDataType(typeof(SeekType))] SeekType seekType = SeekType.OFFSET,
    [EnumDataType(typeof(SortDirection))] SortDirection sort = SortDirection.DESC,
    [EnumDataType(typeof(SerdeTypes))] string? keySerde = null,
    [EnumDataType(typeof(SerdeTypes))] string? valueSerde = null,
    int? Offset = null,
    int? Limit = null,
    DateTime? Timestamp = null
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Partitions.Any(p => !int.TryParse(p, out var _)))
        {
            yield return new ValidationResult(
                "Invalid numeric array.",
                [nameof(Partitions)]
            );
        }

        if (seekType == SeekType.TIMESTAMP && !Timestamp.HasValue)
        {
            yield return new ValidationResult(
                "Timestamp value is required when seek type is 'Timestamp'.",
                [nameof(Timestamp)]
            );
        }

        yield break;
    }

    public int[] PartitionsAsInt() => Partitions.Select(int.Parse).Distinct().ToArray();

    public int LimitOrDefault => Limit ?? 25;
}
