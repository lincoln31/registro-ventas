import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// Configuración principal de la app
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                   // Rutas de la app
    provideHttpClient(),                     // Cliente HTTP
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Inicializa Firebase
    provideAuth(() => getAuth()),            // Autenticación de Firebase
    provideFirestore(() => getFirestore())   // Firestore (base de datos)
  ]
};