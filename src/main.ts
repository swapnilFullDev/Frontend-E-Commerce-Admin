import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app/app.routes';
import { MatIconModule } from '@angular/material/icon';
import { provideServiceWorker, ServiceWorkerModule } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      MatDialogModule,
      MatSnackBarModule,
      MatIconModule,
      // ServiceWorkerModule.register('ngsw-config.json')
    ), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
}).catch(err => console.error(err));