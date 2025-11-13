# 💱 Sistema de Monedas Múltiples - ACTUALIZADO

## ✅ Cambios Implementados

### 🎯 Nueva Funcionalidad

**Ahora las ventas se guardan en su moneda original** (no se convierten a USD)

### 📊 Características

#### 1. **Guardar en Moneda Original**
- ✅ Cada venta se guarda en la moneda que el usuario selecciona
- ✅ No hay conversión automática
- ✅ El importe se calcula en la moneda original

#### 2. **Filtrar por Moneda**
- ✅ Nuevo filtro "Por moneda" en el listado
- ✅ Muestra solo las ventas de una moneda específica
- ✅ Combina con otros filtros (día, mes)

#### 3. **Totales Dinámicos por Moneda**
- ✅ Selector "Calcular totales en"
- ✅ Opción "Todas las monedas" - suma todas sin convertir
- ✅ Opción por moneda específica - suma solo esa moneda
- ✅ Los totales cambian según la moneda seleccionada

#### 4. **Estadísticas Inteligentes**
- ✅ **Total Ventas**: Cuenta solo las ventas de la moneda seleccionada
- ✅ **Ingresos Total**: Suma en la moneda seleccionada
- ✅ **Promedio**: Calcula el promedio en la moneda seleccionada

## 🚀 Cómo Usar

### Registrar una venta:
1. Ve a "Registrar Nueva Venta"
2. Selecciona la moneda (USD, EUR, MXN, etc.)
3. Ingresa el precio en esa moneda
4. **Se guarda en esa moneda original**

### Ver ventas por moneda:
1. Ve a "Listado de Ventas"
2. Selecciona "Tipo de filtro" → "Por moneda"
3. Elige la moneda (USD, EUR, MXN, etc.)
4. Verás solo las ventas en esa moneda

### Calcular totales por moneda:
1. En "Listado de Ventas"
2. Usa el selector "Calcular totales en"
3. Opciones:
   - **Todas las monedas**: Suma todas las ventas (mezcla monedas)
   - **USD**: Suma solo ventas en USD
   - **EUR**: Suma solo ventas en EUR
   - etc.

## 📋 Ejemplos

### Ejemplo 1: Ventas Mixtas
```
Venta 1: 100 USD
Venta 2: 50 EUR
Venta 3: 200 MXN
```

**Si seleccionas "Calcular totales en: Todas las monedas"**
- Total Ventas: 3
- Ingresos Total: $350 (suma directa, no convertida)

**Si seleccionas "Calcular totales en: USD"**
- Total Ventas: 1
- Ingresos Total: $100.00

**Si seleccionas "Calcular totales en: EUR"**
- Total Ventas: 1
- Ingresos Total: €50.00

### Ejemplo 2: Filtrar por Moneda
```
Filtro: "Por moneda" → EUR
Resultado: Solo muestra las ventas en EUR
Totales: Calculados solo en EUR
```

## 🔧 Pasos para Actualizar

### 1. Actualizar la base de datos:
```sql
-- Ejecuta en phpMyAdmin:
USE registro_ventas;

-- Eliminar columna importeUSD si existe
ALTER TABLE ventas DROP COLUMN IF EXISTS importeUSD;

-- Agregar índice para búsquedas por moneda
ALTER TABLE ventas ADD INDEX idx_uid_moneda (uid, moneda);
```

O importa el archivo: `backend-php/migration_remove_importeUSD.sql`

### 2. Reiniciar el servidor:
```bash
ng serve
```

## 📊 Estructura de Datos

### Tabla ventas:
```sql
- id: INT (PK)
- uid: INT (FK a usuarios)
- producto: VARCHAR(255)
- cantidad: INT
- precioUnit: DECIMAL(10,2)
- importe: DECIMAL(10,2)  -- En moneda original
- moneda: VARCHAR(3)       -- USD, EUR, MXN, etc.
- fecha: DATE
- fechaISO: VARCHAR(10)
- mes: VARCHAR(7)
- created_at: TIMESTAMP
```

## 🎨 Interfaz

### Filtros Disponibles:
1. **Todas las ventas** - Sin filtro
2. **Por día específico** - Filtra por fecha
3. **Por mes** - Filtra por mes
4. **Por moneda** - Filtra por moneda (NUEVO)

### Selector de Totales:
- **Todas las monedas** - Suma todas sin discriminar
- **USD** - Solo ventas en dólares
- **EUR** - Solo ventas en euros
- **MXN** - Solo ventas en pesos mexicanos
- etc.

## 💡 Ventajas

✅ **Flexibilidad**: Guarda en cualquier moneda
✅ **Claridad**: No hay conversiones confusas
✅ **Análisis**: Puedes ver totales por moneda
✅ **Simplicidad**: Cada venta mantiene su moneda original
✅ **Filtrado**: Encuentra ventas por moneda fácilmente

## ⚠️ Importante

- Los totales en "Todas las monedas" suman valores directamente (100 USD + 50 EUR = 150)
- Esto NO es una conversión real, solo una suma numérica
- Para análisis precisos, usa el filtro por moneda específica
- Cada moneda se maneja independientemente

## 🐛 Troubleshooting

**No veo el filtro "Por moneda"**
- Asegúrate de haber actualizado el código
- Recarga la página (Ctrl + F5)

**Los totales no cambian**
- Verifica que hayas seleccionado una moneda en "Calcular totales en"
- Asegúrate de tener ventas en esa moneda

**Error al guardar venta**
- Verifica que la base de datos esté actualizada
- Ejecuta el script de migración
