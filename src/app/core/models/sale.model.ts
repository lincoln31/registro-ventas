import { Timestamp } from '@angular/fire/firestore';

// Modelo de datos para una venta
export interface Sale {
  id?: string;          // ID en Firestore (opcional)
  uid: string;          // ID del usuario dueño
  fecha: Timestamp;     // Fecha como Timestamp
  fechaISO: string;     // Fecha en formato YYYY-MM-DD
  mes: string;          // Mes en formato YYYY-MM
  producto: string;     // Nombre del producto
  cantidad: number;     // Cantidad vendida
  precioUnit: number;   // Precio por unidad
  importe: number;      // Total (cantidad * precioUnit)
  createdAt: Timestamp; // Fecha de creación del registro
}
