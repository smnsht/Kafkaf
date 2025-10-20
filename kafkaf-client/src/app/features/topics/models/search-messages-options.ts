import { HttpParams } from '@angular/common/http';
import { SeekType } from '../components/ddl-seek-type/ddl-seek-type';
import { SerdeType } from '../components/ddl-serde/ddl-serde';
import { SortOrderType } from '../components/ddl-sort-order/ddl-sort-order';

export interface SearchMessagesOptions {
  seekType: SeekType;
  partitions: number[];
  keySerde: SerdeType;
  valueSerde: SerdeType;
  sortOrder: SortOrderType;
  offset?: number;
  limit?: number;
  timestamp?: Date;
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
    params = params.append('timestamp', options.timestamp.toISOString());
  }

  return params;
}
