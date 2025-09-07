namespace Kafkaf.Web.ViewModels;

public class MessageViewModel<K, V>
{
    public K? Key { get; set; }
    public V? Value { get; set; }
    public ulong Offset { get; set; }
    public uint Partition { get; set; }
    public DateTime Timestamp { get; set; }
}
