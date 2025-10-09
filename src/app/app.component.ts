import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav *ngIf="auth.isAuthenticated()" class="navbar">
      <div class="nav-brand">
        <h3>Sistema de Ventas</h3>
      </div>
      <div class="nav-links">
        <a routerLink="/ventas/list" routerLinkActive="active">Lista de Ventas</a>
        <a routerLink="/ventas/form" routerLinkActive="active">Nueva Venta</a>
        <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
      </div>
    </nav>
    <main [class.with-nav]="auth.isAuthenticated()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: #007bff;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav-brand h3 {
      margin: 0;
    }
    
    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
    }
    
    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .logout-btn:hover {
      background: #c82333;
    }
    
    main.with-nav {
      padding-top: 2rem;
    }
    
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
  `]
})
export class AppComponent {
  title = 'registro-ventas';
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async logout() {
    await this.auth.logout();
  }
}
