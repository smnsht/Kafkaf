import { LogLevel } from '@app/services/logger/logger';

export const environment = {
  production: false,
  logLevel: LogLevel.Debug,
  apiUrl: 'http://localhost:5175/api',
};
