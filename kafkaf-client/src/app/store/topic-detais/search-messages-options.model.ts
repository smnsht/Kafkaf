import { HttpParams } from '@angular/common/http';
import { SeekType } from '@app/components/features/ddl-seek-type/ddl-seek-type';
import { SerdeType } from '@app/components/features/ddl-serde/ddl-serde';
import { SortOrderType } from '@app/components/features/ddl-sort-order/ddl-sort-order';

export interface SearchMessagesOptions {
  seekType: SeekType;
  partitions: number[];
  keySerde: SerdeType;
  valueSerde: SerdeType;
  sortOrder: SortOrderType;
  offset?: number;
  limit?: number;
  timestamp?: string;
}

export function createHttpParamsFromSearchOptions(options: SearchMessagesOptions): HttpParams {
  const paramsObject = {
    partitions: options.partitions,
    seekType: options.seekType,
    seekDirection: options.sortOrder,
    keySerde: options.keySerde,
    valueSerde: options.valueSerde,
  };

  let params = new HttpParams({ fromObject: paramsObject });

  if (options.limit) {
    params = params.append('limit', options.limit);
  }

  if (options.offset) {
    params = params.append('offset', options.offset);
  }

  if (options.timestamp) {
    const ts = new Date(options.timestamp).toISOString();
    params = params.append('timestamp', ts);
  }

  return params;
}
