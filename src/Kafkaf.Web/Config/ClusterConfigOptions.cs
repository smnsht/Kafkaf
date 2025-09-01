namespace Kafkaf.Web.Config;

public class ClusterConfigOptions
{
    public required string Address { get; set; }
    public required string Alias { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
}


