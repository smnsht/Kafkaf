using System.ComponentModel.DataAnnotations;
using Kafkaf.Web.Components.Topic;
using Kafkaf.Web.Components.UI;
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
        rows = SearchMessages().ToArray();
        return Task.CompletedTask;
    }

    public IEnumerable<MessageViewModel<string, string>> SearchMessages()
    {        
        yield return new MessageViewModel<string, string>()
        {
            Key = "1",
            Value = "asdfasdf",
            Offset = 1,
            Partition = 0,
            Timestamp = DateTime.Now
        };

        yield return new MessageViewModel<string, string>()
        {
            Key = "2",
            Value = "asdfasdf afasdfasdfasd f",
            Offset = 2,
            Partition = 0,
            Timestamp = DateTime.Now
        };
    }
}
