using Kafkaf.Web.Components.Partials.Broker;
using Microsoft.AspNetCore.Components;

namespace Kafkaf.Web.Components.Pages.Brokers;

[Route(BrokerComponent.ROUTE_CONFIGS)]
public partial class Configs : ClusterIndexAwarePage
{
    [Parameter]
    public int brokerIdx { get; set; }
}
