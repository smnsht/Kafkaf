using Confluent.Kafka;

namespace Kafkaf.Web.ViewModels;

public struct TopicsListViewModel
{
    public string TopicName { get; set; }
    public int Partitions { get; set; }
    public int OutOfSyncReplicas { get; set; }
    public string ReplicationFactor { get; set; }
    public int NumberOfMessages { get; set; }
    public int Size { get; set; }

    public TopicsListViewModel(TopicMetadata meta)
    {
        TopicName = meta.Topic;
        Partitions = meta.Partitions.Count;

        if (meta.Partitions.Count > 0)
        {
            ReplicationFactor = meta.Partitions[0].Replicas.Length.ToString();
            OutOfSyncReplicas = meta.Partitions
                .Sum(partition => partition.Replicas[0] - partition.InSyncReplicas[0]);
        }
        else
        {
            ReplicationFactor = "0";
            OutOfSyncReplicas = 0;
        }

        NumberOfMessages = 0; // TODO
        Size = 0; //TODO
    }

    public bool IsInternal
    {
        get => TopicName.StartsWith("__");
    }
}

