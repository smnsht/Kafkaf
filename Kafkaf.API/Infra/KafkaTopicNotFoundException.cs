namespace Kafkaf.API.Infra;

public class KafkaTopicNotFoundException : Exception
{
    public string TopicName { get; }
    public int ClusterNo { get; }

    public KafkaTopicNotFoundException(int clusterNo, string topicName)
        : base($"Kafka topic '{topicName}' was not found in cluster {clusterNo}.")
    {
        TopicName = topicName;
        ClusterNo = clusterNo;
    }
}
