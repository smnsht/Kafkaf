export interface BrokerInfoRow {
  brokerID: number;
  port: number;
  host: string;
  controller: number;
}

export interface BrokerConfigRow {
  isDefault: boolean;
  isReadOnly: boolean;
  isSensitive: boolean;
  name: string;
  value: string;
  source: string;
}

export interface ClusterBroker {
  clusterIdx: number;
  brokerId: number;
}

export interface BrokerDetailsState {
  configs: Map<string, BrokerConfigRow[]>;
  currentClusterId: number;
  currentBrokerId: number;
  loading?: boolean;
  error?: string;
}
