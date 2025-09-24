namespace Kafkaf.API.Models;

public static class KafkaTopicProperties
{
	public static readonly Dictionary<string, (string Type, string DefaultValue)> TopicConfigs = new Dictionary<string, (string Type, string DefaultValue)>
	{
        // Cleanup and Retention
        //{ "cleanup.policy", ("string", "delete") },
        //{ "retention.ms", ("long", "604800000") }, // 7 days
        //{ "retention.bytes", ("long", "-1") }, // unlimited
        { "delete.retention.ms", ("long", "86400000") }, // 1 day
        { "min.cleanable.dirty.ratio", ("double", "0.5") },
		{ "file.delete.delay.ms", ("long", "60000") },

        // Compression
        { "compression.type", ("string", "producer") },
		{ "compression.gzip.level", ("int", "-1") },
		{ "compression.lz4.level", ("int", "0") },
		{ "compression.snappy.level", ("int", "0") },
		{ "compression.zstd.level", ("int", "0") },

        // Segmenting and Indexing
        { "segment.bytes", ("long", "1073741824") }, // 1 GB
        { "segment.ms", ("long", "604800000") }, // 7 days
        { "segment.jitter.ms", ("long", "0") },
		{ "segment.index.bytes", ("long", "10485760") }, // 10 MB
        { "index.interval.bytes", ("int", "4096") },

        // Flushing to Disk
        { "flush.messages", ("long", "9223372036854775807") }, // Long.MaxValue
        { "flush.ms", ("long", "9223372036854775807") }, // Long.MaxValue

        // Replication
        { "min.insync.replicas", ("int", "1") },
		{ "follower.replication.throttled.replicas", ("list", "[]") },
		{ "leader.replication.throttled.replicas", ("list", "[]") },

        // Message Size and Timestamps
        //{ "max.message.bytes", ("int", "1048588") }, // 1 MB
        { "message.downconversion.enable", ("boolean", "true") },
		{ "message.timestamp.type", ("string", "CreateTime") },
		{ "message.timestamp.difference.max.ms", ("long", "9223372036854775807") }, // Long.MaxValue

        // Compaction (for logs with cleanup.policy = compact)
        { "max.compaction.lag.ms", ("long", "9223372036854775807") }, // Long.MaxValue
        { "min.compaction.lag.ms", ("long", "0") }
	};

	public static string[] GetKeys() => TopicConfigs.Keys.ToArray();
	public static string? GetDefaultValue(string key) =>
		TopicConfigs.TryGetValue(key, out var value)
			? value.DefaultValue
			: null;
}

