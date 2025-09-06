using Kafkaf.Web.Components;
using Kafkaf.Web.Config;
using Kafkaf.Web.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddMemoryCache();

//builder.Services.Configure<List<ClusterConfigOptions>>(
//    builder.Configuration.GetSection("Kafkaf:Clusters")
//);
builder.ConfigureClusterConfigOptions();
builder.AddClusterPingServiceOptions();
builder.AddAdminClientConfigOptions();

builder.Services.AddTransient<ClusterPingService>();
builder.Services.AddTransient<AdminClientService>();
builder.Services.AddTransient<TopicsService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();


app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
