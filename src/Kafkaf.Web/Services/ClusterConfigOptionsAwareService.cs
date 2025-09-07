using Kafkaf.Web.Config;

namespace Kafkaf.Web.Services;

//public class ClusterConfigOptionsAwareService<Tself>
//	where Tself : ClusterConfigOptionsAwareService<Tself>
//{
//	protected readonly ILogger<Tself> _logger;
//	protected readonly AdminClientService _adminService;

//	protected ClusterConfigOptions? _clusterConfig;

//	public ClusterConfigOptionsAwareService(ILogger<Tself> logger, AdminClientService adminClientService)
//	{
//		_logger = logger;
//		_adminService = adminClientService;
//	}

//	public Tself SetClusterConfigOptions(ClusterConfigOptions clusterConfig)
//	{
//		_clusterConfig = clusterConfig;
//		_adminService.SetClusterConfigOptions(clusterConfig);

//		return (Tself)this;
//	}
//}
