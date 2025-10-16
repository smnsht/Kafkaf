namespace Kafkaf.API.Models;

public class UpdateTopicModel
{
    public long? TimeToRetain { get; set; }

    public string? CleanupPolicy { get; set; }

    public int? MinInSyncReplicas { get; set; }

    public int? NumPartitions { get; set; }
}
