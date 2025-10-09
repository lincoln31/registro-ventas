import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentasService } from '../../../core/services/ventas.service';

@Component({
  selector: 'app-ventas-form',
  standalone: true, // componente independiente
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas-form.component.html'
})
export class VentasFormComponent {
  private readonly fb = inject(FormBuilder); // para crear formularios
  private readonly ventasService = inject(VentasService); // servicio de ventas

  // señales (estado reactivo)
  readonly isSaving = signal(false); // indica si está guardando
  readonly message = signal<string | null>(null); // muestra mensaje de éxito o error

  // validador personalizado para evitar notación científica
  private noScientificNotation(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && typeof value === 'string' && /[eE]/.test(value)) {
      return { scientificNotation: true };
    }
    return null;
  }

  // validador personalizado para números positivos enteros (cantidad)
  private positiveInteger(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (value <= 0 || !Number.isInteger(Number(value)))) {
      return { positiveInteger: true };
    }
    return null;
  }

  // validador personalizado para números positivos decimales (precio)
  private positiveDecimal(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && value <= 0) {
      return { positiveDecimal: true };
    }
    return null;
  }

  // definición del formulario y validaciones
  form = this.fb.group({
    fecha: ['', Validators.required], // fecha obligatoria
    producto: ['', [Validators.required, Validators.minLength(2)]], // mínimo 2 caracteres
    cantidad: [1, [
      Validators.required, 
      this.positiveInteger.bind(this),
      this.noScientificNotation.bind(this)
    ]], // entero positivo sin notación científica
    precioUnit: [1, [
      Validators.required, 
      this.positiveDecimal.bind(this),
      this.noScientificNotation.bind(this)
    ]] // decimal positivo sin notación científica
  });

  // método para bloquear caracteres no deseados en campos numéricos
  onKeyPress(event: KeyboardEvent, fieldType: 'integer' | 'decimal'): boolean {
    const char = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

    // Bloquear notación científica (e, E)
    if (char.toLowerCase() === 'e') {
      event.preventDefault();
      return false;
    }

    // Bloquear signos negativos (-, +)
    if (char === '-' || char === '+') {
      event.preventDefault();
      return false;
    }

    // Para campos enteros, bloquear punto decimal
    if (fieldType === 'integer' && char === '.') {
      event.preventDefault();
      return false;
    }

    // Para campos decimales, permitir solo un punto
    if (fieldType === 'decimal' && char === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return false;
    }

    // Permitir números, backspace, delete, tab, escape, enter
    if (/[0-9]/.test(char) || 
        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(char) ||
        (fieldType === 'decimal' && char === '.')) {
      return true;
    }

    event.preventDefault();
    return false;
  }

  // método para validar entrada en paste
  onPaste(event: ClipboardEvent, fieldType: 'integer' | 'decimal'): boolean {
    const pastedText = event.clipboardData?.getData('text') || '';
    
    // Bloquear si contiene notación científica
    if (/[eE]/.test(pastedText)) {
      event.preventDefault();
      return false;
    }

    // Bloquear si contiene signos negativos
    if (/[-+]/.test(pastedText)) {
      event.preventDefault();
      return false;
    }

    // Para enteros, bloquear si contiene punto decimal
    if (fieldType === 'integer' && pastedText.includes('.')) {
      event.preventDefault();
      return false;
    }

    // Para decimales, validar formato
    if (fieldType === 'decimal') {
      const decimalCount = (pastedText.match(/\./g) || []).length;
      if (decimalCount > 1) {
        event.preventDefault();
        return false;
      }
    }

    return true;
  }

  // método para guardar venta
  // método para guardar venta
// método para guardar venta
async guardarVenta() {
  // si el formulario es inválido, muestra aviso
  if (this.form.invalid) {
    this.message.set('Por favor completa correctamente el formulario.');
    return;
  }

  this.isSaving.set(true); // activa estado de guardado
  this.message.set(null); // limpia mensaje

  try {
    // Convertir cantidad y precioUnit a números
    const formValue = {
      ...this.form.value,
      cantidad: Number(this.form.value.cantidad),
      precioUnit: Number(this.form.value.precioUnit)
    };
    // guarda la venta usando el servicio
    await this.ventasService.add(formValue as any);

    // muestra éxito
    this.message.set('✅ Venta registrada con éxito.');

    // reinicia el formulario con valores por defecto
    this.form.reset({ cantidad: 1, precioUnit: 1 }); 
  } catch (err) {
    console.error(err, Number(this.form.value.cantidad),Number(this.form.value.precioUnit),);
    // muestra error si falla
    this.message.set('❌ Error al registrar la venta.');
  } finally {
    this.isSaving.set(false); // termina el estado de guardado
  }
}


}
