using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClustersController : ControllerBase
{
	private readonly ClusterService _clusterService;

	public ClustersController(ClusterService clusterService) => _clusterService = clusterService;

	public async Task<ClusterInfoViewModel[]> GetAsync()
	{
		var list = new List<ClusterInfoViewModel>();
		foreach(var cfg in _clusterService.ClusterConfigOptions)
		{
			var meta = await _clusterService.GetMetadataAsync(cfg.Alias);

			var model = new ClusterInfoViewModel()
			{
				Name = meta.OriginatingBrokerName,
				Version = "todo",
				BrokerCount = meta.Brokers.Count,
				OnlinePartitionCount = 0,// TODO
				TopicCount = meta.Topics.Count,
			};

			list.Add(model);
		}

		return list.ToArray();
	}

	//[HttpGet("{clusterNo:int}")]
	//public async Task<ClusterInfoViewModel> GetAsync([FromRoute] int clusterNo)
	//{
	//	var meta = await _clusterService.GetMetadataAsync(clusterNo);

	//	return new ClusterInfoViewModel()
	//	{
	//		Name = meta.OriginatingBrokerName,
	//		Version = "todo",
	//		BrokerCount = meta.Brokers.Count,
	//		OnlinePartitionCount = 0,// TODO
	//		TopicCount = meta.Topics.Count,
	//	};		
	//}

	[Route("Configs")]
	public ClusterConfigViewModel[] GetConfigs()
	{
		var options = _clusterService.ClusterConfigOptions;

		return options.Select(opt =>
			new ClusterConfigViewModel(
				Address: opt.Address,
				Alias: opt.Alias,
				UserName: opt.UserName)).ToArray();
	}
}
