export interface BaseState_OLD<T> {
  itemsMap: Map<number, T[]>;
  clusterIdx: number;
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}

export interface BaseState<T> {
  items: T[];
  clusterIdx: number;
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}

export interface PageState {
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}

export type ItemIdPK = string | number;
