
export interface BatchItemResult {
  item: string;
  success: boolean;
  error?: string | null;
}

export interface BatchResult {
  results: BatchItemResult[];
  message: string | null;
}
