import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',   // Redirige al login por defecto
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'ventas',
        canActivate: [authGuard],  // Solo accesible si el usuario está logueado
        loadChildren: () => import('./features/ventas/ventas.routes').then(m => m.ventasRoutes)
    },
    {
        path: '**',
        redirectTo: '/login'  // Cualquier ruta inválida → login
    }
];
