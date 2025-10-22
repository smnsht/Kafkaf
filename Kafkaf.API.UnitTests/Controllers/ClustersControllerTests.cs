using FakeItEasy;
using Kafkaf.API.Config;
using Kafkaf.API.Services;
using Kafkaf.API.ViewModels;

namespace Kafkaf.API.Controllers.Tests;

public class ClustersControllerTests
{
    private readonly IClusterService clusterService;
    private readonly ClustersController ctrl;

    public ClustersControllerTests()
    {
        clusterService = A.Fake<IClusterService>();
        ctrl = new ClustersController();
    }

    [Fact()]
    public async Task GetClustersAsync()
    {
        // Arrange
        var cfg = new ClusterConfigOptions[]
        {
            new ClusterConfigOptions() { Address = "127.0.0.1", Alias = "local" },
        };

        var retval = new ClusterInfoViewModel { Alias = cfg[0].Alias, Version = "" };

        using var tokenSource = new CancellationTokenSource();
        var ct = tokenSource.Token;

        A.CallTo(() => clusterService.ClusterConfigOptions()).Returns(cfg);
        A.CallTo(() => clusterService.FetchClusterInfoAsync("local", ct))
            .Returns(Task.FromResult(retval));

        // Act
        var result = await ctrl.GetClustersAsync(clusterService, ct);

        // Assert
        Assert.NotNull(result);
        Assert.IsAssignableFrom<IEnumerable<ClusterInfoViewModel>>(result);
        Assert.Single(result);
        Assert.Equal(retval.Alias, result.First().Alias);
    }

    //[Fact()]
    //public void GetConfigsTest()
    //{
    //	Xunit.Assert.Fail("This test needs an implementation");
    //}

    //[Fact()]
    //public void GetClusterTest()
    //{
    //	Xunit.Assert.Fail("This test needs an implementation");
    //}

    //[Fact()]
    //public void GetAsyncTest()
    //{
    //	Xunit.Assert.Fail("This test needs an implementation");
    //}

    //[Fact()]
    //public void GetBrokersAsyncTest()
    //{
    //	Xunit.Assert.Fail("This test needs an implementation");
    //}

    //[Fact()]
    //public void GetBrokerConfigsAsyncTest()
    //{
    //	Xunit.Assert.Fail("This test needs an implementation");
    //}
}
