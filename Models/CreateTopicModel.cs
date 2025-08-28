using System.ComponentModel.DataAnnotations;
using Confluent.Kafka.Admin;

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

     public short ReplicationFactor { get; set; } = -1;

    // TODO: 1 to max replicas
    public int? MinInSyncReplicas { get; set; }

    public long? TimeToRetain { get; set; }

    public long? RetentionBytes { get; set; }

    public int? MaxMessageBytes { get; set; }
    
    public List<TopicCustomParameterModel> CustomParameters { get; set; } = new List<TopicCustomParameterModel>();

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
    
    public TopicSpecification ToTopicSpecification()
    {
        var topic = new TopicSpecification()
        {
            Name = Name,
            NumPartitions = NumPartitions,
            ReplicationFactor = ReplicationFactor,
            Configs = CustomParameters
                .Where(cp => !string.IsNullOrEmpty(cp.Value) && !string.IsNullOrEmpty(cp.Key))
                .ToDictionary(cp => cp.Key!, cp => cp.Value!)                
        };

        topic.Configs.Add("cleanup.policy", CleaupPolicy);

        if(MinInSyncReplicas?.ToString() is string replicas)
        {
            topic.Configs.Add("min.insync.replicas", replicas);
        }

        if(TimeToRetain?.ToString() is string retention)
        {
            topic.Configs.Add("retention.ms", retention);
        }

        if(RetentionBytes?.ToString() is string retentionBytes) 
        {
            topic.Configs.Add("retention.bytes", retentionBytes);
        }

        if(MaxMessageBytes?.ToString() is string maxMessageBytes)
        {
            topic.Configs.Add("max.message.bytes", maxMessageBytes);
        }

        return topic;
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