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
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const { email, password } = this.form.value;
      await this.auth.login(email!, password!);
      this.router.navigate(['/ventas']);
    } catch (error: any) {
      alert(this.auth.handleAuthError(error)); // puedes cambiar por un toast service si quieres
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle() {
    this.loading.set(true);
    try {
      await this.auth.loginWithGoogle();
      this.router.navigate(['/ventas']);
    } catch (error: any) {
      alert(this.auth.handleAuthError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
