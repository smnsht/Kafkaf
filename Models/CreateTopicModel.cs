using System.ComponentModel.DataAnnotations;

namespace Kafkaf.Models;

public enum TopicCleaupPolicy
{
    Delete, Compact
}

public class CreateTopicModel
{    
    [Required]
    public string Name { get; set; } = String.Empty;

    public int NumPartitions { get; set; } = -1;
    
    [Required]    
    public string CleaupPolicy { get; set; } = TopicCleaupPolicy.Delete.ToString();

    public int MinInSyncReplicas { get; set; }
    public int TimeToRetain { get; set; }
    public short ReplicationFactor { get; set; } = -1;
    public int? RetentionBytes { get; set; }
    public int MaxMessageBytes { get; set; }
    public Dictionary<string, string> Configs = new Dictionary<string, string>();    

    public IEnumerable<KeyValuePair<string, string>> CleanupPolicyOptions
    {
        get
        {
            var delete = TopicCleaupPolicy.Delete.ToString();
            var compact = TopicCleaupPolicy.Compact.ToString();

            yield return new KeyValuePair<string, string>("Delete", delete);
            yield return new KeyValuePair<string, string>("Compact", compact);
            yield return new KeyValuePair<string, string>("Compact,Delete", $"{compact},{delete}");
        }
    }
}

public static class CreateTopicModelExtensions
{
    public static string ToString(this TopicCleaupPolicy policy) =>
        policy switch
        {
            TopicCleaupPolicy.Delete => "delete",
            TopicCleaupPolicy.Compact => "Compact",
            _ => throw new ArgumentOutOfRangeException(nameof(policy), policy, null)
        };

}