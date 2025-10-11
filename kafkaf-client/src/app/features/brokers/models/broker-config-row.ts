export interface BrokerConfigRow {
  isDefault: boolean;
  isReadOnly: boolean;
  isSensitive: boolean;
  name: string;
  value: string;
  source: string;
}
