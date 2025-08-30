using Kafkaf.Components.Partials.Broker;
using Kafkaf.Components.UI;
using Microsoft.AspNetCore.Components;

namespace Kafkaf.Components.Pages.Brokers;

[Route(BrokerComponent.ROUTE_METRICS)]
public partial class Metrics : ClusterIndexAwarePage
{
    [Parameter]
    public int brokerIdx { get; set; }
}
