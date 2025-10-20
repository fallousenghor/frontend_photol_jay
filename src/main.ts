import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Import PWA elements for Capacitor plugins
import '@capacitor/camera/dist/esm/web.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
