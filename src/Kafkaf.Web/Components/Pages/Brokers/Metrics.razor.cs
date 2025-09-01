using Kafkaf.Web.Components.Partials.Broker;
using Kafkaf.Web.Components.UI;
using Microsoft.AspNetCore.Components;

namespace Kafkaf.Web.Components.Pages.Brokers;

[Route(BrokerComponent.ROUTE_METRICS)]
public partial class Metrics : ClusterIndexAwarePage
{
    [Parameter]
    public int brokerIdx { get; set; }
}
