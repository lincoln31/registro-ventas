import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register', // Nombre del componente en HTML
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html' // Vista asociada
})
export class RegisterComponent {
  // Inyección de dependencias (formularios, auth y router)
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Estado de carga (true/false)
  readonly loading = signal(false);

  // Formulario reactivo con validaciones
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],        // Email obligatorio y válido
    password: ['', [Validators.required, Validators.minLength(6)]], // Contraseña mínima 6 caracteres
    confirmPassword: ['', [Validators.required]]                 // Confirmar contraseña obligatoria
  });

  // Acción al enviar formulario
  async onSubmit() {
    // No hace nada si el formulario no es válido
    if (this.form.invalid) return;

    // Verifica que las contraseñas coincidan
    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true); // Muestra cargando
    try {
      // Registra el usuario con email y password
      const { email } = this.form.value;
      await this.auth.register(email!, password!);

      // Redirige a ventas si fue exitoso
      this.router.navigate(['/ventas']);
    } catch (error: any) {
      // Muestra el error de autenticación
      alert(this.auth.handleAuthError(error));
    } finally {
      this.loading.set(false); // Oculta cargando
    }
  }
}
