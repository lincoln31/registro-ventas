import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VentasService } from '../../../core/services/ventas.service';
import { Sale } from '../../../core/models/sale.model';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas-list',
  standalone: true, // componente independiente
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ventas-list.component.html'
})
export class VentasListComponent {
  private readonly ventasService = inject(VentasService); // servicio de ventas

  ventas$!: Observable<Sale[]>; // lista de ventas (observable)

  // filtros para mostrar ventas
  filtroTipo = signal<'all' | 'day' | 'month'>('all'); // tipo de filtro
  fechaISO = signal(''); // filtro por día (YYYY-MM-DD)
  mes = signal('');      // filtro por mes (YYYY-MM)

  // carga inicial de ventas
  ngOnInit() {
    this.cargarVentas();
  }

  // cargar ventas según filtro
  cargarVentas() {
    switch (this.filtroTipo()) {
      case 'day':
        if (this.fechaISO()) {
          this.ventas$ = this.ventasService.byDay(this.fechaISO());
        }
        break;
      case 'month':
        if (this.mes()) {
          this.ventas$ = this.ventasService.byMonth(this.mes());
        }
        break;
      default:
        this.ventas$ = this.ventasService.all(); // todas las ventas
    }
  }

  // eliminar una venta
  async eliminarVenta(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta venta?')) {
      try {
        await this.ventasService.delete(id);
      } catch (err) {
        console.error('Error eliminando venta', err);
      }
    }
  }

  // ayuda a Angular a identificar cada venta (optimiza ngFor)
  trackByVentaId(index: number, venta: Sale): string {
    return venta.id || index.toString();
  }

  // calcular el total de ingresos
  calculateTotal(ventas: Sale[] | null): number {
    if (!ventas) return 0;
    return ventas.reduce((total, venta) => total + venta.importe, 0);
  }

  // calcular promedio de ventas
  calculateAverage(ventas: Sale[] | null): number {
    if (!ventas || ventas.length === 0) return 0;
    return this.calculateTotal(ventas) / ventas.length;
  }
}
