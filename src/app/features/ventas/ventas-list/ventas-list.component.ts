import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasService } from '../../../core/services/ventas.service';
import { Sale } from '../../../core/models/sale.model';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-list.component.html'
})
export class VentasListComponent {
  private readonly ventasService = inject(VentasService);

  ventas$!: Observable<Sale[]>;

  // filtros reactivos
  filtroTipo = signal<'all' | 'day' | 'month'>('all');
  fechaISO = signal('');
  mes = signal('');

  // cargar todas al inicio
  ngOnInit() {
    this.cargarVentas();
  }

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
        this.ventas$ = this.ventasService.all();
    }
  }

  async eliminarVenta(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta venta?')) {
      try {
        await this.ventasService.delete(id);
      } catch (err) {
        console.error('Error eliminando venta', err);
      }
    }
  }
}
