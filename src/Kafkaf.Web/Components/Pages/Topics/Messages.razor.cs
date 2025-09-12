using System.ComponentModel.DataAnnotations;
using Kafkaf.Web.Components.Topic;
using Kafkaf.Web.Services;
using Kafkaf.Web.ViewModels;
using Microsoft.AspNetCore.Components;

namespace Kafkaf.Web.Components.Pages.Topics;

public enum SeekType
{
    [Display(Name = "Offset")]
    Offset,

    [Display(Name = "Timestamp")]
    Timestamp
}

[Route(TopicComponent.ROUTE_MESSAGES)]
public partial class Messages : ClusterIndexAwarePage
{
    [Parameter]
    public string topicName { get; set; } = string.Empty;

	[Inject]
	public required MessagesService messagesService { get; set; }

    private SeekType seekType = SeekType.Offset;
    private SerdeKind keySerde = SerdeKind.String;
    private SerdeKind valueSerde = SerdeKind.String;
    private SortKind sortKind = SortKind.Asc;
    private string? searchText;

    private MessageViewModel<string, string>[]? rows;

    private void HandleSeekTypeChanged(object e) => seekType = (SeekType)e;
    private void HandleKeySerdeChanged(object e) => keySerde = (SerdeKind)e;
    private void HandleValueSerdeChanged(object e) => valueSerde = (SerdeKind)e;
    private void HandleSortKindChanged(object e) => sortKind = (SortKind)e;

    private void HandleClear()
    {
        seekType = SeekType.Offset;
        keySerde = SerdeKind.String;
        valueSerde = SerdeKind.String;
        sortKind = SortKind.Asc;
        searchText = null;
        rows = null;
    }

    private Task HandleSearchAsync()
    {
		loading = true;
		rows = null;

		var list = messagesService
			.SetClusterConfigOptions(ClusterConfig)
			.ReadMessages(topicName);

		rows = list.ToArray();
		loading = false;
		return Task.CompletedTask;
		//var _ = await RunWithLoadingAsync(() =>
		//{
		//	rows = null;

		//	var list = messagesService
		//		.SetClusterConfigOptions(ClusterConfig)
		//		.ReadMessages(topicName);

		//	rows = list.ToArray();
		//	return Task.CompletedTask;
		//});
	}
}
