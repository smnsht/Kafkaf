import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { KafkafTitleStrategy } from './services/kafkaf-title-strategy';
import { provideHttpClient } from '@angular/common/http';
import { LoggerService } from './services/logger.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: TitleStrategy, useClass: KafkafTitleStrategy },
    { provide: LoggerService, useFactory: () => new LoggerService(environment.logLevel) }
  ],
};
