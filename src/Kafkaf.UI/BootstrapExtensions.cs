namespace Kafkaf.UI;

public enum BootstrapButtonStyle
{    
    Primary,    
    Secondary,
    Success,
    Danger,
    Warning,
    Info,
    Light,
    Dark,
    OutlinePrimary,
    OutlineSecondary,
    OutlineSuccess,
    OutlineDanger,
    OutlineWarning,
    OutlineInfo,
    OutlineLight,
    OutlineDark,
    Link
};

public enum BootstrapButtonSize
{
    Small, Large
}

public enum BootstrapAlertStyle
{
    Primary,
    Secondary,
    Success,
    Danger,
    Warning,
    Info,
    Light,
    Dark
}

public static class BootstrapExtensions
{
    public static string ToCssClass(this BootstrapButtonStyle style) =>
        style switch
        {
            BootstrapButtonStyle.Primary => "btn-primary",
            BootstrapButtonStyle.Secondary => "btn-secondary",
            BootstrapButtonStyle.Success => "btn-success",
            BootstrapButtonStyle.Danger => "btn-danger",
            BootstrapButtonStyle.Warning => "btn-warning",
            BootstrapButtonStyle.Info => "btn-info",
            BootstrapButtonStyle.Light => "btn-light",
            BootstrapButtonStyle.Dark => "btn-dark",

            BootstrapButtonStyle.OutlinePrimary => "btn-outline-primary",
            BootstrapButtonStyle.OutlineSecondary => "btn-outline-secondary",
            BootstrapButtonStyle.OutlineSuccess => "btn-outline-success",
            BootstrapButtonStyle.OutlineDanger => "btn-outline-danger",
            BootstrapButtonStyle.OutlineWarning => "btn-outline-warning",
            BootstrapButtonStyle.OutlineInfo => "btn-outline-info",
            BootstrapButtonStyle.OutlineLight => "btn-outline-light",
            BootstrapButtonStyle.OutlineDark => "btn-outline-dark",

            BootstrapButtonStyle.Link => "btn-link",
            _ => throw new ArgumentOutOfRangeException(nameof(style), style, null)
        };

    public static string ToCssClass(this BootstrapButtonSize size) =>
        size switch 
        {
            BootstrapButtonSize.Small => "btn-sm",
            BootstrapButtonSize.Large => "btn-lg",
            _ => throw new ArgumentOutOfRangeException(nameof(size), size, null)
        };

    public static string ToCssClass(this BootstrapAlertStyle style) =>
        style switch
        {
            BootstrapAlertStyle.Primary => "alert-primary",
            BootstrapAlertStyle.Secondary => "alert-secondary",
            BootstrapAlertStyle.Success => "alert-success",
            BootstrapAlertStyle.Danger => "alert-danger",
            BootstrapAlertStyle.Warning => "alert-warning",
            BootstrapAlertStyle.Info => "alert-info",
            BootstrapAlertStyle.Light => "alert-light",
            BootstrapAlertStyle.Dark => "alert-dark",            
            _ => throw new ArgumentOutOfRangeException(nameof(style), style, null)
        };

}
