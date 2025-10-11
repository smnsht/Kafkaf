import { SeekType } from "../components/ddl-seek-type/ddl-seek-type";
import { SerdeType } from "../components/ddl-serde/ddl-serde";
import { SortOrderType } from "../components/ddl-sort-order/ddl-sort-order";

export interface SearchMessagesOptions {
  seekType: SeekType;
  partitions: number[];
  keySerde: SerdeType;
  valueSerde: SerdeType;
  sortOrder: SortOrderType;
}
