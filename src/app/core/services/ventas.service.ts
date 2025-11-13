import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sale } from '../models/sale.model';
import { CurrencyService } from './currency.service';

/**
 * Tipo para la entrada de una venta, excluyendo campos generados automáticamente.
 * Incluye la fecha como string.
 */
type SaleInput = Omit<Sale, 'id' | 'uid' | 'importe' | 'fechaISO' | 'mes' | 'created_at'> & {
  fecha: string;
};

/**
 * Estructura de respuesta estándar de la API.
 */
interface ApiResponse {
  success: boolean;
  data?: any[];
  message?: string;
}

/**
 * Servicio para gestionar las operaciones de ventas.
 * Permite crear, consultar y eliminar ventas, así como filtrar por moneda, día o mes.
 */
@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly http = inject(HttpClient);
  private readonly currencyService = inject(CurrencyService);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Agrega una nueva venta.
   * @param sale Datos de la venta a registrar
   * @throws Error si la creación falla
   */
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

  /**
   * Obtiene ventas filtradas por moneda.
   * @param moneda Código de la moneda (ej: 'USD', 'ARS')
   * @returns Observable con el listado de ventas
   */
  byCurrency(moneda: string): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=currency&value=${moneda}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Obtiene ventas por día específico.
   * @param fechaISO Fecha en formato ISO (YYYY-MM-DD)
   * @returns Observable con el listado de ventas
   */
  byDay(fechaISO: string): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=day&value=${fechaISO}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Obtiene ventas por mes específico.
   * @param mes Mes en formato 'YYYY-MM'
   * @returns Observable con el listado de ventas
   */
  byMonth(mes: string): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=month&value=${mes}`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Obtiene todas las ventas registradas.
   * @returns Observable con el listado de todas las ventas
   */
  all(): Observable<Sale[]> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/ventas/list.php?filter=all`,
      { withCredentials: true }
    ).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Elimina una venta por su ID.
   * @param id Identificador de la venta a eliminar
   * @throws Error si la eliminación falla
   */
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
