namespace Kafkaf.API.Models;

public static class KafkaTopicProperties
{
	private const string BOOLEAN = "boolean";
	private const string STRING = "string";
	private const string LONG = "long";
	private const string INT = "int";
	private const string DOUBLE = "double";

	private const string FALSE = "false";
	private const string MAX_LONG = "9223372036854775807";

	public static readonly IReadOnlySet<string> COMPRESSION_TYPES = new HashSet<string>(
		StringComparer.OrdinalIgnoreCase
	)
	{
		"uncompressed",
		"zstd",
		"lz4",
		"snappy",
		"gzip",
		"producer",
	};

	public static readonly IReadOnlySet<string> MESSAGE_IMESTAMP_TYPES = new HashSet<string>(
		StringComparer.OrdinalIgnoreCase
	)
	{
		"CreateTime",
		"LogAppendTime",
	};

	/// <summary>
	/// From Kafka: https://docs.confluent.io/platform/current/installation/configuration/topic-configs.html
	/// </summary>
	public static readonly IReadOnlyDictionary<
		string,
		(string Type, string DefaultValue)
	> TOPIC_CONFIGS = new Dictionary<string, (string Type, string DefaultValue)>
	{
		// Cleanup and Retention
		//{ "cleanup.policy", ("string", "delete") },
		//{ "retention.ms", ("long", "604800000") }, // 7 days
		//{ "retention.bytes", ("long", "-1") }, // unlimited
		{ "delete.retention.ms", (LONG, "86400000") }, // 1 day
		{ "min.cleanable.dirty.ratio", (DOUBLE, "0.5") },
		{ "file.delete.delay.ms", (LONG, "60000") },
		{ "local.retention.ms", (LONG, "-2") },
		{ "local.retention.bytes", (LONG, "-2") },
		{ "preallocate", (BOOLEAN, FALSE) },
		{ "unclean.leader.election.enable", (BOOLEAN, FALSE) },
		// Compression
		{ "compression.type", (STRING, "producer") },
		{ "compression.gzip.level", (INT, "-1") },
		{ "compression.lz4.level", (INT, "0") },
		//{ "compression.snappy.level", ("int", "0") },
		{ "compression.zstd.level", (INT, "0") },
		// Segmenting and Indexing
		{ "segment.bytes", (LONG, "1073741824") }, // 1 GB
		{ "segment.ms", (LONG, "604800000") }, // 7 days
		{ "segment.jitter.ms", (LONG, "0") },
		{ "segment.index.bytes", (LONG, "10485760") }, // 10 MB
		{ "index.interval.bytes", (INT, "4096") },
		// Flushing to Disk
		{ "flush.messages", (LONG, MAX_LONG) }, // Long.MaxValue
		{ "flush.ms", (LONG, MAX_LONG) }, // Long.MaxValue
		// Replication
		//{ "min.insync.replicas", ("int", "1") },
		//{ "follower.replication.throttled.replicas", ("list", "[]") },
		//{ "leader.replication.throttled.replicas", ("list", "[]") },

		// Message Size and Timestamps
		//{ "max.message.bytes", ("int", "1048588") }, // 1 MB
		//{ "message.downconversion.enable", ("boolean", "true") },
		{ "message.timestamp.type", (STRING, "CreateTime") },
		//{ "message.timestamp.difference.max.ms", ("long", "9223372036854775807") }, // Long.MaxValue
		{ "message.timestamp.after.max.ms", (LONG, "3600000") },
		{ "message.timestamp.before.max.ms", (LONG, MAX_LONG) },
		// Compaction (for logs with cleanup.policy = compact)
		{ "max.compaction.lag.ms", (LONG, MAX_LONG) }, // Long.MaxValue
		{ "min.compaction.lag.ms", (LONG, "0") },
		// Remote
		{ "remote.log.delete.on.disable", (BOOLEAN, FALSE) },
		{ "remote.log.copy.disable", (BOOLEAN, FALSE) },
		{ "remote.storage.enable", (BOOLEAN, FALSE) },
	};

	public static string[] GetKeys() => TOPIC_CONFIGS.Keys.ToArray();

	public static string? GetDefaultValue(string key) =>
		TOPIC_CONFIGS.TryGetValue(key, out var value) ? value.DefaultValue : null;
}
