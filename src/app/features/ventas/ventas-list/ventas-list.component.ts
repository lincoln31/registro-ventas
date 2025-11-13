import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VentasService } from '../../../core/services/ventas.service';
import { CurrencyService } from '../../../core/services/currency.service';
import { Sale } from '../../../core/models/sale.model';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ventas-list.component.html'
})
export class VentasListComponent {
  private readonly ventasService = inject(VentasService);
  readonly currencyService = inject(CurrencyService);

  ventas$!: Observable<Sale[]>;

  // filtros para mostrar ventas
  filtroTipo = signal<'all' | 'day' | 'month' | 'currency'>('all');
  fechaISO = signal('');
  mes = signal('');
  filtroMoneda = signal('');
  
  // moneda seleccionada para cálculos de totales
  displayCurrency = signal('ALL');

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
      case 'currency':
        if (this.filtroMoneda()) {
          this.ventas$ = this.ventasService.byCurrency(this.filtroMoneda());
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
        this.cargarVentas(); // Recargar lista
      } catch (err) {
        console.error('Error eliminando venta', err);
      }
    }
  }

  trackByVentaId(index: number, venta: Sale): string {
    return venta.id || index.toString();
  }

  // calcular el total según la moneda seleccionada (SINCRONO)
  calculateTotal(ventas: Sale[] | null): number {
    if (!ventas) return 0;
    
    const selectedCurrency = this.displayCurrency();
    
    if (selectedCurrency === 'ALL') {
      return ventas.reduce((total, venta) => total + venta.importe, 0);
    }
    
    const ventasFiltradas = ventas.filter(v => v.moneda === selectedCurrency);
    return ventasFiltradas.reduce((total, venta) => total + venta.importe, 0);
  }

  // calcular promedio de ventas (SINCRONO)
  calculateAverage(ventas: Sale[] | null): number {
    if (!ventas || ventas.length === 0) return 0;
    
    const selectedCurrency = this.displayCurrency();
    
    if (selectedCurrency === 'ALL') {
      const total = ventas.reduce((sum, venta) => sum + venta.importe, 0);
      return total / ventas.length;
    }
    
    const ventasFiltradas = ventas.filter(v => v.moneda === selectedCurrency);
    if (ventasFiltradas.length === 0) return 0;
    
    const total = ventasFiltradas.reduce((sum, venta) => sum + venta.importe, 0);
    return total / ventasFiltradas.length;
  }

  getCurrentSymbol(): string {
    const currency = this.displayCurrency();
    if (currency === 'ALL') return '$';
    return this.currencyService.getCurrencySymbol(currency);
  }

  getCurrentCurrencyName(): string {
    const currency = this.displayCurrency();
    if (currency === 'ALL') return 'Todas las monedas';
    const found = this.currencyService.currencies.find(c => c.code === currency);
    return found ? found.name : currency;
  }

  countByCurrency(ventas: Sale[] | null): number {
    if (!ventas) return 0;
    const selectedCurrency = this.displayCurrency();
    if (selectedCurrency === 'ALL') return ventas.length;
    return ventas.filter(v => v.moneda === selectedCurrency).length;
  }
}
