import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentasService } from '../../../core/services/ventas.service';

@Component({
  selector: 'app-ventas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas-form.component.html'
})
export class VentasFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ventasService = inject(VentasService);

  // estado reactivo
  readonly isSaving = signal(false);
  readonly message = signal<string | null>(null);

  form = this.fb.group({
    fecha: ['', Validators.required],
    producto: ['', [Validators.required, Validators.minLength(2)]],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precioUnit: [1, [Validators.required, Validators.min(1)]]
  });

  async guardarVenta() {
    if (this.form.invalid) {
      this.message.set('Por favor completa correctamente el formulario.');
      return;
    }

    this.isSaving.set(true);
    this.message.set(null);

    try {
      await this.ventasService.add(this.form.value as any);
      this.message.set('✅ Venta registrada con éxito.');
      this.form.reset({ cantidad: 1, precioUnit: 1 }); // reiniciar con valores por defecto
    } catch (err) {
      console.error(err);
      this.message.set('❌ Error al registrar la venta.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
