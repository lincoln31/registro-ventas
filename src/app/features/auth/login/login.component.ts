import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Inyección de dependencias
  private readonly fb = inject(FormBuilder);   // para crear formularios
  private readonly auth = inject(AuthService); // servicio de auth
  private readonly router = inject(Router);    // navegación

  // Estado de carga
  readonly loading = signal(false);

  // Formulario reactivo con validaciones
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // campo email
    password: ['', [Validators.required]]                // campo contraseña
  });

  // Enviar formulario (login con email/contraseña)
  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const { email, password } = this.form.value;
      await this.auth.login(email!, password!);  // login
      this.router.navigate(['/ventas']);         // redirige al dashboard
    } catch (error: any) {
      alert(this.auth.handleAuthError(error));   // muestra error
    } finally {
      this.loading.set(false);                   // termina carga
    }
  }


}
