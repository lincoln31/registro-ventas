import { Timestamp } from '@angular/fire/firestore';

export interface Sale {
  id?: string;          // ID generado por Firestore
  uid: string;          // Usuario dueño de la venta
  fecha: Timestamp;     // Fecha como Timestamp (consulta por rango)
  fechaISO: string;     // YYYY-MM-DD (para filtros directos por día)
  mes: string;          // YYYY-MM (para filtros por mes)
  producto: string;
  cantidad: number;
  precioUnit: number;
  importe: number;      // cantidad * precioUnit
  createdAt: Timestamp; // Fecha de creación
}
