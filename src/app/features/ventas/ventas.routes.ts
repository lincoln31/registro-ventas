import { Routes } from '@angular/router';

export const ventasRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./ventas-list/ventas-list.component').then(m => m.VentasListComponent)
  },
  {
    path: 'form',
    loadComponent: () => import('./ventas-form/ventas-form.component').then(m => m.VentasFormComponent)
  },
  {
    path: 'form/:id',
    loadComponent: () => import('./ventas-form/ventas-form.component').then(m => m.VentasFormComponent)
  }
];