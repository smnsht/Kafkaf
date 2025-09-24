using Microsoft.AspNetCore.Mvc;

namespace Kafkaf.API.ViewModels;

public class BatchActionResult : ActionResult
{
	private readonly BatchResult _result;

	public BatchActionResult(BatchResult result) => _result = result;

	public BatchActionResult(IEnumerable<BatchItemResult> results, string? message)
		: this(new BatchResult(results, message)) { }

	public override void ExecuteResult(ActionContext context)
	{
		var objectResult = ToObjectResult();
		objectResult.ExecuteResult(context);
	}

	public override async Task ExecuteResultAsync(ActionContext context)
	{
		var objectResult = ToObjectResult();
		await objectResult.ExecuteResultAsync(context);
	}

	private ObjectResult ToObjectResult() =>
		(_result.AllSucceeded, _result.AllFailed) switch
		{
			// All succeeded
			(true, _) => new OkObjectResult(_result),
			// All failed
			(_, true) => new BadRequestObjectResult(_result),
			// 207 Multi-Status is semantically correct
			_ => new ObjectResult(_result) { StatusCode = StatusCodes.Status207MultiStatus },
		};
}
