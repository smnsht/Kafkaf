export interface ProblemDetails {
  type?: string; // A URI reference that identifies the problem type
  title?: string; // A short, human-readable summary of the problem
  status?: number; // The HTTP status code
  detail?: string; // A human-readable explanation specific to this occurrence
  instance?: string; // A URI reference that identifies the specific occurrence
  [key: string]: any; // Extension members (custom fields from server)
}
