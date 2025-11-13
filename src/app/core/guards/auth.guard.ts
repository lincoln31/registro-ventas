// Importamos `inject` de Angular para poder usar inyección de dependencias sin necesidad de clases
import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';
// Importamos nuestro servicio de autenticación que valida si el usuario está logueado
import { AuthService } from '../services/auth.service';
// Definimos un guard (protector de rutas) llamado `authGuard`
export const authGuard: CanActivateFn = () => {
  // Obtenemos una instancia del servicio de autenticación
  const auth = inject(AuthService);

  // Obtenemos una instancia del Router para poder redirigir si hace falta
  const router = inject(Router);

  // Si el usuario está autenticado:
  if (auth.isAuthenticated()) {
    return true; //  Permite el acceso a la ruta
  } else {
    // Si no está autenticado:
    router.navigate(['/login']); //  Lo redirigimos a la página de login
    return false; //  Bloquea el acceso a la ruta protegida
  }
};
