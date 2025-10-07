import { LogLevel } from "../app/services/logger.service";

export const environment = {
  production: false,
  logLevel: LogLevel.Info,
  apiUrl: 'http://localhost:5175/api'
};
