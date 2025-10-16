using System.ComponentModel.DataAnnotations;

namespace Kafkaf.API.Config;

public class MessagesReaderServiceOptions : MessageConsumerOptions
{
    [Range(5, 15)]
    public int OffsetsForTimesTimeout { get; set; } = 10;

    [Range(1, 5)]
    public int QueryWatermarkOffsetsTimeout { get; set; } = 1;

    [Range(1, 5)]
    public int ConsumeTimeout { get; set; } = 1;

    [Range(25, 10000)]
    public int MaxMessages { get; set; } = 100;
}
