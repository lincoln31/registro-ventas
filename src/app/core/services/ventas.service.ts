import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, where, orderBy } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';  // 👈 Importar desde Firebase SDK
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';

type SaleInput = Omit<Sale, 'id' | 'uid' | 'importe' | 'fechaISO' | 'mes' | 'createdAt' | 'fecha'> & {
  fecha: string; // el form manda string de input[type=date]
};

@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly fs = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly colRef = collection(this.fs, 'ventas');

  async add(sale: SaleInput): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const fecha = new Date(sale.fecha);
    const fechaISO = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
    const mes = fechaISO.substring(0, 7); // YYYY-MM
    const importe = sale.cantidad * sale.precioUnit;

    const payload: Sale = {
      ...sale,
      uid,
      fecha: Timestamp.fromDate(fecha),   // Firestore timestamp
      fechaISO,
      mes,
      importe,
      createdAt: Timestamp.now()
    };

    await addDoc(this.colRef, payload as any);
  }

  byDay(fechaISO: string): Observable<Sale[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const q = query(
      this.colRef,
      where('uid', '==', uid),
      where('fechaISO', '==', fechaISO),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Sale[]>;
  }

  byMonth(mes: string): Observable<Sale[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const q = query(
      this.colRef,
      where('uid', '==', uid),
      where('mes', '==', mes),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Sale[]>;
  }

  all(): Observable<Sale[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');

    const q = query(
      this.colRef,
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Sale[]>;
  }

  delete(id: string): Promise<void> {
    return deleteDoc(doc(this.fs, `ventas/${id}`));
  }
}
