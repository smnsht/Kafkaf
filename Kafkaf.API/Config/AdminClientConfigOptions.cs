using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Config;

public class AdminClientConfigOptions
{
    public const long DefaultTimeoutInSeconds = 5;

    [Range(5, 60, ErrorMessage = "AdminClientConfig: TimeoutInSeconds must be between 5 and 60 seconds")]
    public long TimeoutInSeconds { get; set; } = DefaultTimeoutInSeconds;

    // TODO
    public int? OperationTimeout { get; set; }
    public int? RequestTimeout { get; set; }
}

