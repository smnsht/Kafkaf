using System.ComponentModel.DataAnnotations;

namespace Kafkaf.ViewModels;
public enum SeekType
{
    [Display(Name = "Offset")]
    Offset,

    [Display(Name = "Timestamp")]
    Timestamp
}

public enum SortKind
{
    [Display(Name = "Oldest First")]
    Asc,

    [Display(Name = "Newest First")]
    Desc
}

public enum SerdeKind
{
    [Display(Name = "String")]
    String,

    [Display(Name = "Int32")]
    Int32,

    [Display(Name = "Int32")]
    Int64,

    [Display(Name = "Long")]
    Long
}
