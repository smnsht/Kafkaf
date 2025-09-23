using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;

namespace Kafkaf.API.Facades;

public class TopicDetailsFacade
{
	private readonly TopicsService _topicsService;
	private readonly WatermarkOffsetsService _consumerService;

	public TopicDetailsFacade(TopicsService topicsService, WatermarkOffsetsService consumerService)
	{
		_topicsService = topicsService;
		_consumerService = consumerService;
	}

	public async Task<TopicDetailsViewModel> GetTopicDetails(int clusterNo, string topicName)
	{
		var topicResult = await _topicsService.DescribeTopicsAsync(clusterNo, topicName);
		var desc =
			topicResult.TopicDescriptions.FirstOrDefault()
			?? throw new InvalidOperationException(
				$"Topic '{topicName}' was not found in cluster {clusterNo}."
			);

		var partitions = desc.Partitions.Select(p => p.Partition).ToArray();
		var partitionOffsets = _consumerService.GetWatermarkOffsets(
			clusterNo,
			topicName,
			partitions ?? []
		);

		return new TopicDetailsViewModel(desc, partitionOffsets);
	}
}
