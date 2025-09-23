using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API;

public enum ClusterFeature
{
	KAFKA_CONNECT,
	KSQL_DB,
	SCHEMA_REGISTRY,
	TOPIC_DELETION,
	KAFKA_ACL_VIEW,
	KAFKA_ACL_EDIT
}

public enum CleanupPolicy
{
	[Display(Name = "delete")]
	DELETE,

	[Display(Name = "compact")]
	COMPACT,

	[Display(Name = "compact,delete")]
	COMPACT_DELETE,

	[Display(Name = "unknown")]
	UNKNOWN
}

public enum SeekType
{
	[Display(Name = "Offset")]
	OFFSET,

	[Display(Name = "Timestamp")]
	TIMESTAMP
}

public enum SeekDirection
{
	[Display(Name = "Oldest First")]
	FORWARD,

	[Display(Name = "Newest First")]
	BACKWARD,

	[Display(Name = "Live Mode")]
	TAILING
}
