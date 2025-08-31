using System.ComponentModel.DataAnnotations;

namespace Kafkaf.UI.Models;

public class TopicCustomParameterModel : IValidatableObject, ICloneable
{   
    [Required]
    public string? Key { get; set; }

    [Required]
    public string? Value { get; set; }

    public object Clone()
    {
        return new TopicCustomParameterModel 
        { 
            Key = Key, 
            Value = Value 
        };
    }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Basic null/empty check for key and value
        if (Key is not string k || Value is not string v)
        {
            yield return new ValidationResult("Custom property key and value must not be blank.");
            yield break;
        }

        // Unknown property check
        if (!KafkaTopicProperties.TopicConfigs.TryGetValue(k, out var topicConfig))
        {
            yield return new ValidationResult("Unknown or blank custom property name.");
            yield break;
        }

        // Type-specific validation
        var valid = topicConfig.Type switch
        {
            "string" => true,
            "long" => long.TryParse(v, out _),
            "int" => int.TryParse(v, out _),
            "boolean" => bool.TryParse(v, out _),
            _ => throw new ArgumentException(
                             $"Unknown topic config type '{topicConfig.Type}'!")
        };

        if (!valid)
        {
            yield return new ValidationResult(
                $"Value of custom property must be of type '{topicConfig.Type}'.");
        }        
    }

    public void Reset()
    {
        Key = null;
        Value = null;
    }
}