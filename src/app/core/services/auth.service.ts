
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

/**
 * Representa un usuario autenticado en la aplicación.
 */
interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
}

/**
 * Respuesta del backend para operaciones de autenticación.
 */
interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

/**
 * Servicio para gestionar la autenticación de usuarios.
 * Proporciona métodos para login, registro, logout y manejo de estado de autenticación.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  readonly currentUser = signal<AuthUser | null>(null);
  readonly isLoading = signal(true);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.initializeAuth();
  }

  /**
   * Inicializa el estado de autenticación verificando si hay usuario en localStorage.
   */
  private initializeAuth(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
    this.isLoading.set(false);
  }

  /**
   * Inicia sesión con email y contraseña.
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @throws Error si la autenticación falla
   */
  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true })
    );
    
    if (response.success && response.user) {
      this.currentUser.set(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.router.navigate(['/ventas']);
    } else {
      throw new Error(response.message || 'Error de autenticación');
    }
  }

  /**
   * Registra un nuevo usuario con email y contraseña.
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @throws Error si el registro falla
   */
  async register(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { email, password }, { withCredentials: true })
    );
    
    if (response.success && response.user) {
      this.currentUser.set(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.router.navigate(['/ventas']);
    } else {
      throw new Error(response.message || 'Error al registrar');
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.get(`${this.apiUrl}/auth/logout`, { withCredentials: true })
    );
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  /**
   * Maneja errores de autenticación y devuelve un mensaje legible.
   * @param error Error recibido
   * @returns Mensaje de error para mostrar al usuario
   */
  handleAuthError(error: any): string {
    return error.error?.message || error.message || 'Error de autenticación';
  }
}
