import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <!-- Navbar visible solo si el usuario está autenticado -->
    <nav *ngIf="auth.isAuthenticated()" class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container-fluid">
        <!-- Logo / Marca -->
        <a class="navbar-brand d-flex align-items-center" href="#">
          <i class="bi bi-graph-up-arrow me-2"></i>
          <span class="fw-bold">Sistema de Ventas</span>
        </a>
        
        <!-- Botón responsive para colapsar el menú -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Menú de navegación -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/ventas/list" routerLinkActive="active">
                <i class="bi bi-list-ul me-1"></i>
                Lista de Ventas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/ventas/form" routerLinkActive="active">
                <i class="bi bi-plus-circle me-1"></i>
                Nueva Venta
              </a>
            </li>
          </ul>
          
          <!-- Menú de usuario -->
          <div class="navbar-nav">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                Usuario
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <!-- Botón para cerrar sesión -->
                  <button class="dropdown-item d-flex align-items-center" (click)="logout()">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Contenedor principal (ajusta el padding si hay navbar) -->
    <main class="main-container" [class.with-nav]="auth.isAuthenticated()">
      <router-outlet></router-outlet> <!-- Aquí se cargan las páginas -->
    </main>
  `,
  styles: [`
    /* Estilos de la barra de navegación */
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Estilo para el logo */
    .navbar-brand {
      font-size: 1.25rem;
      font-weight: 700;
      color: white !important;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .navbar-brand:hover {
      transform: scale(1.05);
    }

    /* Estilos para links del menú */
    .nav-link {
      color: rgba(255, 255, 255, 0.9) !important;
      font-weight: 500;
      padding: 0.5rem 1rem !important;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      margin: 0 0.25rem;
    }
    .nav-link:hover {
      color: white !important;
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    .nav-link.active {
      color: white !important;
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Estilos para dropdown */
    .dropdown-menu {
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border-radius: 0.75rem;
      padding: 0.5rem;
      margin-top: 0.5rem;
    }
    .dropdown-item {
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    .dropdown-item:hover {
      background-color: #f8f9fa;
      transform: translateX(5px);
    }

    /* Ajuste del contenedor principal cuando hay navbar */
    .main-container.with-nav {
      padding-top: 80px;
    }

    @media (max-width: 991.98px) {
      .navbar-nav {
        padding-top: 1rem;
      }
      .nav-link {
        margin: 0.25rem 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'registro-ventas'; // título de la app
  readonly auth = inject(AuthService); // servicio de autenticación
  private readonly router = inject(Router);

  // Método para cerrar sesión
  async logout() {
    await this.auth.logout();
  }
}
