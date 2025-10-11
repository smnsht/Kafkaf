export enum LogLevel {
  None,
  Error,
  Warn,
  Info,
  Debug,
  Trace,
}

export class LoggerService {
  constructor(private logLevel: LogLevel = LogLevel.Info) {}

  log(level: LogLevel, message: string, ...optionalParams: any[]) {
    if (level <= this.logLevel) {
      switch (level) {
        case LogLevel.Error:
          console.error(message, ...optionalParams);
          break;
        case LogLevel.Warn:
          console.warn(message, ...optionalParams);
          break;
        case LogLevel.Info:
          console.info(message, ...optionalParams);
          break;
        case LogLevel.Debug:
          console.debug(message, ...optionalParams);
          break;
        case LogLevel.Trace:
          console.trace(message, ...optionalParams);
          break;
      }
    }
  }

  error(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.Error, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.Warn, message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.Info, message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.Debug, message, ...optionalParams);
  }

  trace(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.Trace, message, ...optionalParams);
  }
}
