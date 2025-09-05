using System.ComponentModel.DataAnnotations;

namespace Kafkaf.Web.Config;

public class ClusterPingServiceOptions
{
    public const long DefaultTimeoutInSeconds = 5;

    [Range(5, 60, ErrorMessage = "ClusterPingService: TimeoutInSeconds must be between 5 and 60 seconds")]
    public long TimeoutInSeconds { get; set; } = DefaultTimeoutInSeconds;
}