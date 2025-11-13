# Backend PHP - Registro de Ventas

## Instalación

1. **Copiar archivos a tu servidor web:**
   ```bash
   cp -r backend-php /var/www/html/registro-ventas-backend
   # O si usas XAMPP:
   cp -r backend-php C:/xampp/htdocs/registro-ventas-backend
   ```

2. **Crear la base de datos en phpMyAdmin:**
   - Abre phpMyAdmin (http://localhost/phpmyadmin)
   - Importa el archivo `database.sql`
   - O copia y ejecuta el SQL manualmente

3. **Configurar la conexión:**
   - Edita `config/database.php` si tu usuario/contraseña de MySQL es diferente

## Endpoints API

### Autenticación

**POST** `/api/auth/register.php`
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Nombre Usuario"
}
```

**POST** `/api/auth/login.php`
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**GET** `/api/auth/logout.php`

### Ventas

**POST** `/api/ventas/create.php`
```json
{
  "producto": "Producto A",
  "cantidad": 5,
  "precioUnit": 100.50,
  "fecha": "2025-12-11"
}
```

**GET** `/api/ventas/list.php?filter=all`
**GET** `/api/ventas/list.php?filter=day&value=2025-12-11`
**GET** `/api/ventas/list.php?filter=month&value=2025-12`

**DELETE** `/api/ventas/delete.php?id=1`

## URL Base
`http://localhost/registro-ventas-backend`
