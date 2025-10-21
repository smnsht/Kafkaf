using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API;

public enum ClusterFeature
{
    KAFKA_CONNECT,
    KSQL_DB,
    SCHEMA_REGISTRY,
    TOPIC_DELETION,
    KAFKA_ACL_VIEW,
    KAFKA_ACL_EDIT,
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
    UNKNOWN,
}

public enum SeekType
{
	[Display(Name = "From latest")]
	END,

	[Display(Name = "From beginning")]
	BEGINNING,

	[Display(Name = "Offset")]
    OFFSET,

    [Display(Name = "Timestamp")]
    TIMESTAMP,
}

public enum SortDirection
{
	[Display(Name = "Oldest First")]
    DESC,

	[Display(Name = "Newest First")]
	ASC
}

public enum SerdeTypes
{
    [Display(Name = "String")]
    String,

    [Display(Name = "Int32")]
    Int32,

    [Display(Name = "Int64")]
    INT64,

    [Display(Name = "UInt32")]
    Int64,

    [Display(Name = "UInt64")]
    UInt64,

    [Display(Name = "Avro")]
    Avro,

    [Display(Name = "Base64")]
    Base64,

    [Display(Name = "UUIDBinary")]
    UUIDBinary,

    [Display(Name = "ProtobufDecodeRaw")]
    ProtobufDecodeRaw,
}
