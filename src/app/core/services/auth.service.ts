import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly googleProvider = new GoogleAuthProvider();

  // Signals para estado reactivo
  readonly currentUser = signal<AuthUser | null>(null);
  readonly isLoading = signal(true);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user ? this.mapUser(user) : null);
      this.isLoading.set(false);
    });
  }

  private mapUser(user: User): AuthUser {
    return {
      id: user.uid,
      email: user.email!,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined
    };
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/ventas']); // redirigir tras login
  }

  async register(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/ventas']); // redirigir tras registro
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, this.googleProvider);
    this.router.navigate(['/ventas']);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  handleAuthError(error: FirebaseError): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/email-already-in-use':
        return 'Email ya registrado';
      case 'auth/weak-password':
        return 'Contraseña muy débil';
      case 'auth/popup-closed-by-user':
        return 'Inicio de sesión cancelado';
      default:
        return 'Error de autenticación';
    }
  }
}
