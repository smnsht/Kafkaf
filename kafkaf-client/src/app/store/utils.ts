import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetails } from '@app/models/problem-details';

export function getErrorMessage2(err: HttpErrorResponse): string {
  let errorMessage = 'An unexpected error occurred';

  // Check if the response body looks like ProblemDetails
  const problem = err.error as ProblemDetails;
  if (problem && (problem.title || problem.detail)) {
    errorMessage = problem.detail || problem.title!;
  } else if (err.message) {
    errorMessage = err.message;
  }

  return errorMessage;
}
