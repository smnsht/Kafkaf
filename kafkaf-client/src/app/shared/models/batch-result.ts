import { BatchItemResult } from './batch-item-result';

export interface BatchResult {
    results: BatchItemResult[];
    message: string | null;
}
