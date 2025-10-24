import { BrokerConfigRow } from './broker-config-row.model';

export interface BrokerDetailsState {
  configs: Map<string, BrokerConfigRow[]>;
  currentClusterId: number;
  currentBrokerId: number;
  loading?: boolean;
  error?: string;
}
