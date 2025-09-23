using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Config;

public class MessagesReaderServiceOptions: MessageConsumerOptions
{
	[Range(1, 5, ErrorMessage = "ConsumeTimeoutInSeconds must be between 1 and 5")]
	public int ConsumeTimeoutInSeconds { get; set; } = 1;

	[Range(100, 10000, ErrorMessage = "MaxMessages must be between 100 and 10000")]
	public int MaxMessages { get; set; } = 100;
}
