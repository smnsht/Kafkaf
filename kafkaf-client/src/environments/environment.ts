import { LogLevel } from '@app/services/logger/logger';

export const environment = {
  production: true,
  logLevel: LogLevel.Warn,
  apiUrl: 'http://localhost:5175/api',
};
