namespace Kafkaf.API.Config;

public class ClusterConfigOptions
{
    public required string Address { get; set; }
    public required string Alias { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }

    public override bool Equals(object? obj)
    {
        if (obj is not ClusterConfigOptions other)
            return false;

        return string.Equals(Address, other.Address, StringComparison.OrdinalIgnoreCase)
            && string.Equals(Alias, other.Alias, StringComparison.OrdinalIgnoreCase)
            && string.Equals(UserName, other.UserName, StringComparison.Ordinal)
            && string.Equals(Password, other.Password, StringComparison.Ordinal);
    }

    public override int GetHashCode() =>
        HashCode.Combine(Address, Alias, UserName, Password);
}


