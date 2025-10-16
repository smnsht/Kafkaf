using System.ComponentModel.DataAnnotations;
using Confluent.Kafka;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Kafkaf.API.Infra;

public class ApiExceptionFilter : IExceptionFilter
{
	private readonly ILogger<ApiExceptionFilter> _logger;

	public ApiExceptionFilter(ILogger<ApiExceptionFilter> logger) => _logger = logger;

	public void OnException(ExceptionContext context)
	{
		// Let validation errors pass through unchanged
		if (context.Exception is ValidationException)
			return;

		_logger.LogError(context.Exception, "Unhandled exception occurred");

		switch (context.Exception)
		{
			case KafkaTopicNotFoundException notFoundEx:
				context.Result = new NotFoundObjectResult(
					new
					{
						error = notFoundEx.Message,
						type = nameof(KafkaTopicNotFoundException)
					}
				);
				context.ExceptionHandled = true;
				break;

			case KafkaException kafkaEx:
				// Use ControllerBase.Problem() equivalent
				var problem = new ProblemDetails
				{
					Title = "Kafka error",
					Detail = kafkaEx.Error.Reason,
					Status = StatusCodes.Status500InternalServerError,
					Instance = context.HttpContext.Request.Path,
				};

				context.Result = new ObjectResult(problem) { StatusCode = problem.Status };
				context.ExceptionHandled = true;
				break;

			default:
				// Fallback: generic Problem
				var genericProblem = new ProblemDetails
				{
					Title = "An unexpected error occurred",
					Detail = context.Exception.Message,
					Status = StatusCodes.Status500InternalServerError,
					Instance = context.HttpContext.Request.Path,
				};

				context.Result = new ObjectResult(genericProblem)
				{
					StatusCode = genericProblem.Status,
				};
				context.ExceptionHandled = true;
				break;
		}
	}
}
