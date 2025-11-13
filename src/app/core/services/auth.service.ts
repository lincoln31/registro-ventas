import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

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

  private initializeAuth(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
    this.isLoading.set(false);
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/login.php`, { email, password }, { withCredentials: true })
    );
    
    if (response.success && response.user) {
      this.currentUser.set(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.router.navigate(['/ventas']);
    } else {
      throw new Error(response.message || 'Error de autenticación');
    }
  }

  async register(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/register.php`, { email, password }, { withCredentials: true })
    );
    
    if (response.success && response.user) {
      this.currentUser.set(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.router.navigate(['/ventas']);
    } else {
      throw new Error(response.message || 'Error al registrar');
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.get(`${this.apiUrl}/auth/logout.php`, { withCredentials: true })
    );
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  handleAuthError(error: any): string {
    return error.error?.message || error.message || 'Error de autenticación';
  }
}
