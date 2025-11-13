-- Migración para eliminar importeUSD y agregar índice de moneda
-- Ejecuta esto en phpMyAdmin si ya tienes la tabla ventas creada

USE registro_ventas;

-- Eliminar columna importeUSD si existe
ALTER TABLE ventas DROP COLUMN IF EXISTS importeUSD;

-- Agregar índice para búsquedas por moneda
ALTER TABLE ventas ADD INDEX idx_uid_moneda (uid, moneda);

-- Verificar estructura
DESCRIBE ventas;
