import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function init() {
  try {
    await bootstrapApplication(App, appConfig);
  } catch (error) {
    console.error(error);
  }
}

init();
