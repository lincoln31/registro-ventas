import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Configuración principal de la app
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                   // Rutas de la app
    provideHttpClient()                      // Cliente HTTP para API PHP
  ]
};