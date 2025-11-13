import { Injectable, signal } from '@angular/core';

export interface ExchangeRates {
  base: string;
  rates: { [key: string]: number };
  date: string;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly apiUrl = 'https://api.exchangerate-api.com/v4/latest';
  
  // Monedas disponibles
  readonly currencies = [
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
    { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
    { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
    { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
    { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' }
  ];

  // Tasas de cambio en caché
  private ratesCache = signal<ExchangeRates | null>(null);
  private lastUpdate = signal<Date | null>(null);

  // Obtener tasas de cambio
  async getRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
    try {
      const response = await fetch(`${this.apiUrl}/${baseCurrency}`);
      if (!response.ok) throw new Error('Error al obtener tasas');
      
      const data = await response.json();
      this.ratesCache.set(data);
      this.lastUpdate.set(new Date());
      return data;
    } catch (error) {
      console.error('Error obteniendo tasas de cambio:', error);
      throw error;
    }
  }

  // Convertir monto entre monedas
  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;

    const rates = await this.getRates(from);
    const rate = rates.rates[to];
    
    if (!rate) throw new Error(`No se encontró tasa para ${to}`);
    
    return amount * rate;
  }

  // Convertir a USD (moneda base)
  async convertToUSD(amount: number, fromCurrency: string): Promise<number> {
    return this.convert(amount, fromCurrency, 'USD');
  }

  // Obtener símbolo de moneda
  getCurrencySymbol(code: string): string {
    return this.currencies.find(c => c.code === code)?.symbol || code;
  }

  // Formatear monto con moneda
  formatAmount(amount: number, currency: string): string {
    const symbol = this.getCurrencySymbol(currency);
    return `${symbol}${amount.toFixed(2)}`;
  }
}
