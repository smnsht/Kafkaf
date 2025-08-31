using Kafkaf.UI.Components.Partials.Broker;
using Kafkaf.UI.Components.UI;
using Microsoft.AspNetCore.Components;

namespace Kafkaf.UI.Components.Pages.Brokers;

[Route(BrokerComponent.ROUTE_METRICS)]
public partial class Metrics : ClusterIndexAwarePage
{
    [Parameter]
    public int brokerIdx { get; set; }
}
