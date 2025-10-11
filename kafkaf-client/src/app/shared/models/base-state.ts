export interface BaseState<T> {
  itemsMap: Map<number, T[]>;
  clusterIdx: number;
  loading?: boolean | null;
  error?: string | null;
  notice?: string | null;
}
