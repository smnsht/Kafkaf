using Kafkaf.Config;

namespace Kafkaf;

public static class CachingExtensions
{
    public static string CacheKey(this ClusterConfigOptions clusterConfig) 
        => $"$CCO:{clusterConfig.Alias}/{clusterConfig.Address}";
}
