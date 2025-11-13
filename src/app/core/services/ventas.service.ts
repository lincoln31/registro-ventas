import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sale } from '../models/sale.model';
import { CurrencyService } from './currency.service';

type SaleInput = Omit<Sale, 'id' | 'uid' | 'importe' | 'fechaISO' | 'mes' | 'created_at'> & {
  fecha: string;
};

interface ApiResponse {
  success: boolean;
  data?: any[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly http = inject(HttpClient);
  private readonly currencyService = inject(CurrencyService);
  private readonly apiUrl = environment.apiUrl;

  async add(sale: SaleInput): Promise<void> {
    // Guardar en la moneda original sin convertir
    const response = await this.http.post<ApiResponse>(
      `${this.apiUrl}/ventas/create.php`,
      sale,
      { withCredentials: true }
    ).toPromise();

    if (!response?.success) {
      throw new Error(response?.message || 'Error al crear venta');
    }
  }

  // Obtener ventas filtradas por moneda
  byCurrency(moneda: string): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=currency&value=${moneda}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  byDay(fechaISO: string): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=day&value=${fechaISO}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  byMonth(mes: string): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=month&value=${mes}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  all(): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=all`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  delete(id: string): Promise<void> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/ventas/delete.php?id=${id}`,
      { withCredentials: true }
    ).toPromise().then(response => {
      if (!response?.success) {
        throw new Error(response?.message || 'Error al eliminar');
      }
    });
  }
}
