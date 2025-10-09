import { Routes } from '@angular/router';

// Rutas del módulo de ventas
export const ventasRoutes: Routes = [
  {
    path: '',                 // ruta vacía
    redirectTo: 'list',       // redirige a la lista de ventas
    pathMatch: 'full'
  },
  {
    path: 'list',             // /ventas/list
    loadComponent: () => 
      import('./ventas-list/ventas-list.component')
        .then(m => m.VentasListComponent) // carga el listado
  },
  {
    path: 'form',             // /ventas/form (nueva venta)
    loadComponent: () => 
      import('./ventas-form/ventas-form.component')
        .then(m => m.VentasFormComponent) // carga el formulario
  },
  {
    path: 'form/:id',         // /ventas/form/:id (editar venta existente)
    loadComponent: () => 
      import('./ventas-form/ventas-form.component')
        .then(m => m.VentasFormComponent) // mismo formulario
  }
];
