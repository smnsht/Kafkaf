namespace Kafkaf.API.ViewModels;

using System.Collections.Immutable;
using System.Text.Json.Serialization;

public record BatchItemResult(string item, bool success, string? error = null);

public record BatchResult(IReadOnlyList<BatchItemResult> results, string? message = null)
{
	public BatchResult(IEnumerable<BatchItemResult> results, string? message = null)
		: this(results.ToImmutableList(), message)
	{
		if (!results.Any())
		{
			throw new ArgumentOutOfRangeException(nameof(results), "Results list is empty.");
		}
	}

	[JsonIgnore]
	public bool AllSucceeded => results.All(r => r.success);
	[JsonIgnore]
	public bool AllFailed => results.All(r => !r.success);
	[JsonIgnore]
	public bool AnySucceeded => results.Any(r => r.success);
	[JsonIgnore]
	public bool AnyFailed => results.Any(r => !r.success);
}
