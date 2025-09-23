using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Config;

public class MessageConsumerOptions
{
	[Required]
	[RegularExpression(
		"^[a-zA-Z0-9._-]{1,255}$",
		ErrorMessage = "GroupId must be 1-255 characters and contain only letters, numbers, '.', '_', or '-'"
	)]
	public required string GroupId { get; set; }

	[Range(3, 30, ErrorMessage = "TimeoutInSeconds must be between 3 and 30")]
	public int TimeoutInSeconds { get; set; } = 10;
}
