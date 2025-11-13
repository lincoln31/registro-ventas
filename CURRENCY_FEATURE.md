# 💱 Funcionalidad de Conversión de Monedas

## ✅ Implementación Completada

Se ha integrado exitosamente la API de Exchange Rate para convertir monedas en el sistema de registro de ventas.

## 🎯 Características Implementadas

### 1. Servicio de Monedas (`currency.service.ts`)
- ✅ Conexión con API pública de tasas de cambio
- ✅ Soporte para 7 monedas principales (USD, EUR, MXN, COP, ARS, CLP, BRL)
- ✅ Conversión automática entre monedas
- ✅ Caché de tasas de cambio
- ✅ Formateo de montos con símbolos

### 2. Formulario de Ventas
- ✅ Selector de moneda en el formulario
- ✅ Conversión automática a USD al guardar
- ✅ Resumen dinámico con símbolo de moneda correcto
- ✅ Valores por defecto en USD

### 3. Lista de Ventas
- ✅ Columna de moneda en la tabla
- ✅ Selector para cambiar moneda de visualización
- ✅ Totales calculados en USD (moneda base)
- ✅ Símbolos de moneda correctos en cada fila

### 4. Base de Datos
- ✅ Campo `moneda` (VARCHAR(3))
- ✅ Campo `importeUSD` (DECIMAL) para conversión
- ✅ Actualización del script SQL

### 5. Backend PHP
- ✅ Soporte para recibir y guardar moneda
- ✅ Almacenamiento de importe en USD

## 📊 Monedas Soportadas

| Código | Nombre | Símbolo |
|--------|--------|---------|
| USD | Dólar Estadounidense | $ |
| EUR | Euro | € |
| MXN | Peso Mexicano | $ |
| COP | Peso Colombiano | $ |
| ARS | Peso Argentino | $ |
| CLP | Peso Chileno | $ |
| BRL | Real Brasileño | R$ |

## 🚀 Cómo Usar

### Registrar una venta en otra moneda:
1. Ve a "Registrar Nueva Venta"
2. Selecciona la moneda deseada (ej: EUR)
3. Ingresa el precio en esa moneda
4. El sistema convierte automáticamente a USD al guardar

### Ver ventas en diferentes monedas:
1. Ve a "Listado de Ventas"
2. Usa el selector "Mostrar en" para cambiar la moneda de visualización
3. Los totales siempre se muestran en USD (moneda base)

## 🔧 API Utilizada

**Exchange Rate API**
- URL: https://api.exchangerate-api.com/v4/latest
- Tipo: Pública y gratuita
- Sin autenticación requerida
- Actualización diaria de tasas

## 📝 Pasos para Activar

### 1. Actualizar la base de datos:
```sql
-- Ejecuta esto en phpMyAdmin si ya tienes la tabla ventas creada
ALTER TABLE ventas 
ADD COLUMN moneda VARCHAR(3) DEFAULT 'USD' AFTER importe,
ADD COLUMN importeUSD DECIMAL(10,2) AFTER moneda;
```

### 2. O crear la base de datos desde cero:
```bash
# Importa el archivo actualizado en phpMyAdmin
backend-php/database.sql
```

### 3. Iniciar la aplicación:
```bash
ng serve
```

## 🎨 Ejemplo de Uso

```typescript
// Convertir 100 EUR a USD
const usd = await currencyService.convert(100, 'EUR', 'USD');

// Formatear monto con símbolo
const formatted = currencyService.formatAmount(100, 'EUR'); // "€100.00"

// Obtener símbolo de moneda
const symbol = currencyService.getCurrencySymbol('MXN'); // "$"
```

## 🔄 Flujo de Conversión

1. Usuario ingresa venta en EUR (100 EUR)
2. Sistema obtiene tasa de cambio EUR → USD
3. Convierte automáticamente (ej: 100 EUR = 108 USD)
4. Guarda ambos valores en la base de datos:
   - `importe`: 100 (en EUR)
   - `importeUSD`: 108 (convertido)
   - `moneda`: 'EUR'
5. En el listado, muestra en la moneda original
6. Los totales se calculan en USD para consistencia

## 🎯 Beneficios

- ✅ Ventas internacionales
- ✅ Comparación justa entre ventas en diferentes monedas
- ✅ Reportes unificados en USD
- ✅ Flexibilidad para el usuario
- ✅ Tasas de cambio actualizadas diariamente

## 🐛 Troubleshooting

**Error: No se pueden obtener tasas de cambio**
- Verifica tu conexión a internet
- La API es pública y no requiere autenticación

**Las conversiones no son exactas**
- Las tasas se actualizan diariamente
- Son tasas de referencia, no comerciales

**No veo el campo de moneda**
- Asegúrate de haber actualizado la base de datos
- Verifica que el backend esté corriendo
