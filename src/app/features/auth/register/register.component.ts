import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.form.invalid) return;

    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    try {
      const { email } = this.form.value;
      await this.auth.register(email!, password!);
      this.router.navigate(['/ventas']);
    } catch (error: any) {
      alert(this.auth.handleAuthError(error));
    } finally {
      this.loading.set(false);
    }
  }
}