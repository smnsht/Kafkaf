using Kafkaf.Components.Partials.Broker;
using Kafkaf.Components.UI;
using Microsoft.AspNetCore.Components;

namespace Kafkaf.Components.Pages.Brokers;

[Route(BrokerComponent.ROUTE_CONFIGS)]
public partial class Configs : ClusterIndexAwarePage
{
    [Parameter]
    public int brokerIdx { get; set; }
}
