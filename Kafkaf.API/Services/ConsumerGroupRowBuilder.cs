using Kafkaf.API.ViewModels;

namespace Kafkaf.API.Services;

public class ConsumerGroupRowBuilder
{
    private readonly IConsumersService _consumers;
    private readonly IWatermarkOffsetsService _watermarks;

    public ConsumerGroupRowBuilder(
        IConsumersService consumers,
        IWatermarkOffsetsService watermarks
    )
    {
        _consumers = consumers;
        _watermarks = watermarks;
    }

    public async Task<IEnumerable<ConsumerGroupRow>> BuildAsync(
        int clusterIdx,
		CancellationToken ct,
        Func<ConsumerGroupRow, ConsumerGroupRow?> transform
    )
    {
        var groups = await _consumers.GetConsumersAsync(clusterIdx, ct);

        var allPartitions = groups.SelectMany(g => g.Offsets.Keys).Distinct().ToList();

        var watermarkResults = _watermarks.GetWatermarkOffsets(clusterIdx, allPartitions);

        return groups
            .Select(g => ConsumerGroupRow.FromConsumerGroupInfo(g, watermarkResults))
            .Select(transform)
            .Where(r => r != null)!;
    }
}
