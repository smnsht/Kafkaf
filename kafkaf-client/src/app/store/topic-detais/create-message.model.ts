export interface CreateMessage {
  partition?: number;
  keySerde: string;
  valueSerde: string;
  keepContents?: boolean;
  key?: string;
  value?: string;
  headers?: Record<string, string>;
  rawJson?: string;
}
