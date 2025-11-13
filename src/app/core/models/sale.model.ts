// Modelo de datos para una venta
export interface Sale {
  id?: string;          // ID de la venta
  uid: number;          // ID del usuario dueño
  fecha: string;        // Fecha en formato YYYY-MM-DD
  fechaISO: string;     // Fecha en formato YYYY-MM-DD
  mes: string;          // Mes en formato YYYY-MM
  producto: string;     // Nombre del producto
  cantidad: number;     // Cantidad vendida
  precioUnit: number;   // Precio por unidad
  importe: number;      // Total (cantidad * precioUnit) en la moneda original
  moneda: string;       // Código de moneda (USD, EUR, MXN, etc.)
  created_at?: string;  // Fecha de creación del registro
}
