using Confluent.Kafka;

namespace Kafkaf.API.Config;

public class ClusterConfigOptions
{
    public required string Address { get; set; }
    public required string Alias { get; set; }
    public string? SaslUsername { get; set; }
    public string? SaslPassword { get; set; }
	public SaslMechanism? SaslMechanism { get; set; }
	public SecurityProtocol? SecurityProtocol { get; set; }

	public override bool Equals(object? obj)
    {
        if (obj is not ClusterConfigOptions other)
            return false;

		return string.Equals(Address, other.Address, StringComparison.OrdinalIgnoreCase)
			&& string.Equals(Alias, other.Alias, StringComparison.OrdinalIgnoreCase)
			&& string.Equals(SaslUsername, other.SaslUsername, StringComparison.Ordinal)
			&& string.Equals(SaslPassword, other.SaslPassword, StringComparison.Ordinal)
			&& string.Equals(SaslMechanism?.ToString(), other.SaslMechanism?.ToString(), StringComparison.Ordinal)
			&& string.Equals(SecurityProtocol?.ToString(), other.SecurityProtocol?.ToString(), StringComparison.Ordinal);
    }

    public override int GetHashCode() =>
        HashCode.Combine(Address, Alias, SaslUsername, SaslPassword);
}


