using System.ComponentModel.DataAnnotations;
using Kafkaf.API.Validators;

namespace Kafkaf.API.Models;

public record DeleteTopicsRequest(string[] names) : IValidatableObject
{
	public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
	{
		if (!names.Any())
		{
			yield return new ValidationResult(
				"Topics list must not be empty.",
				new[] { nameof(names) }
			);
		}

		foreach (var topic in names)
		{
			if (!KafkaTopicValidator.IsValidTopicName(topic, out var error))
			{
				yield return new ValidationResult(error, [topic]);
			}
		}
	}
}
