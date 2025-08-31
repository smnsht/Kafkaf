using Kafkaf.UI.Config;

namespace Kafkaf.UI;

public static class CachingExtensions
{
    public static string CacheKey(this ClusterConfigOptions clusterConfig) 
        => $"$CCO:{clusterConfig.Alias}/{clusterConfig.Address}";

    public static string CacheKey(this ClusterConfigOptions clusterConfig, string topicName)
        => $"$TOPIC:{clusterConfig.Alias}/{clusterConfig.Address}/{topicName}";
}
