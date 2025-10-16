using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Config;

public class AdminClientConfigOptions
{
    public const long DefaultTimeoutInSeconds = 10;

	[Range(5, 30)]
	public int OperationTimeout { get; set; } = (int)DefaultTimeoutInSeconds;

	[Range(5, 30)]
	public int RequestTimeout { get; set; } = (int)DefaultTimeoutInSeconds;
}

