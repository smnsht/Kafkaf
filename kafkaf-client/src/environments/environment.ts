import { LogLevel } from "../app/services/logger.service";

export const environment = {
  production: true,
  LogLevel: LogLevel.Warn,
  apiUrl: 'http://localhost:5175/api'
};
