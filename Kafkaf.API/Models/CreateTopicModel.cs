using System.ComponentModel.DataAnnotations;
using Confluent.Kafka.Admin;
using Kafkaf.API.Validators;

namespace Kafkaf.API.Models;

public class CreateTopicModel : IValidatableObject
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public int NumPartitions { get; set; } = -1;

    [Required]
    [AllowedValues("delete", "compact", "compact,delete")]
    public string CleaupPolicy { get; set; } = "delete";

    public short ReplicationFactor { get; set; } = -1;

    public int? MinInSyncReplicas { get; set; }

    public long? TimeToRetain { get; set; }

    public long? RetentionBytes { get; set; }

    public int? MaxMessageBytes { get; set; }

    public List<TopicCustomParameterModel> CustomParameters { get; set; } =
        new List<TopicCustomParameterModel>();

    public TopicSpecification ToTopicSpecification()
    {
        var topic = new TopicSpecification()
        {
            Name = Name,
            NumPartitions = NumPartitions,
            ReplicationFactor = ReplicationFactor,
            Configs = CustomParameters
                .Where(cp =>
                    !string.IsNullOrEmpty(cp.Value) && !string.IsNullOrEmpty(cp.Key)
                )
                .ToDictionary(cp => cp.Key!, cp => cp.Value!),
        };

        topic.Configs.Add("cleanup.policy", CleaupPolicy);

        if (MinInSyncReplicas?.ToString() is string replicas)
        {
            topic.Configs.Add("min.insync.replicas", replicas);
        }

        if (TimeToRetain?.ToString() is string retention)
        {
            topic.Configs.Add("retention.ms", retention);
        }

        if (RetentionBytes?.ToString() is string retentionBytes)
        {
            topic.Configs.Add("retention.bytes", retentionBytes);
        }

        if (MaxMessageBytes?.ToString() is string maxMessageBytes)
        {
            topic.Configs.Add("max.message.bytes", maxMessageBytes);
        }

        return topic;
    }

	public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
	{		
		if (!KafkaTopicValidator.IsValidTopicName(Name, out var error))
		{
			yield return new ValidationResult(error, [nameof(Name)]);
		}		
	}
}
