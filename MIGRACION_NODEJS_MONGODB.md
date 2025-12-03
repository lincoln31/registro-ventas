# 🚀 Migración a Node.js + Express + MongoDB

## ✅ Cambios Realizados

Hemos migrado el backend de **PHP + MySQL** a **Node.js + Express + MongoDB** (Stack MEAN).

## 📋 Pasos para Instalar y Ejecutar

### 1. Instalar MongoDB

#### Ubuntu/Debian:
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Agregar repositorio
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Actualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar
sudo systemctl status mongod
```

#### O usar MongoDB Atlas (Nube - Gratis):
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta gratuita
3. Crea un cluster (M0 - Free)
4. Obtén tu connection string
5. Actualiza `.env` con tu URL

### 2. Instalar Dependencias del Backend

```bash
cd backend-node
npm install
```

### 3. Configurar Variables de Entorno

Edita `backend-node/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/registro_ventas
SESSION_SECRET=cambiar_por_algo_muy_seguro_y_aleatorio
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

### 4. Iniciar el Backend

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo normal
npm start
```

Deberías ver:
```
✅ Conectado a MongoDB
🚀 Servidor corriendo en http://localhost:3000
📊 Entorno: development
```

### 5. Iniciar el Frontend Angular

En otra terminal:
```bash
ng serve
```

### 6. Probar la Aplicación

1. Abre http://localhost:4200
2. Registra un nuevo usuario
3. Inicia sesión
4. Crea ventas en diferentes monedas
5. Prueba los filtros

## 🔄 Diferencias con PHP

### Antes (PHP + MySQL):
```
backend-php/
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   └── register.php
│   └── ventas/
│       ├── create.php
│       ├── list.php
│       └── delete.php
└── config/
    └── database.php
```

### Ahora (Node.js + MongoDB):
```
backend-node/
├── controllers/
│   ├── authController.js
│   └── ventasController.js
├── models/
│   ├── Usuario.js
│   └── Venta.js
├── routes/
│   ├── auth.js
│   └── ventas.js
├── middleware/
│   └── auth.js
└── server.js
```

## 📊 Comparación de Tecnologías

| Aspecto | PHP + MySQL | Node.js + MongoDB |
|---------|-------------|-------------------|
| Lenguaje | PHP | JavaScript |
| Base de Datos | MySQL (Relacional) | MongoDB (NoSQL) |
| Servidor | Apache/XAMPP | Node.js |
| ORM/ODM | PDO | Mongoose |
| Sesiones | PHP Sessions | express-session |
| Estructura | Archivos PHP | MVC con Express |

## 🎯 Ventajas de MongoDB

✅ **Flexibilidad**: Esquema flexible, fácil de modificar
✅ **JSON Nativo**: Trabaja directamente con objetos JavaScript
✅ **Escalabilidad**: Fácil de escalar horizontalmente
✅ **Velocidad**: Rápido para lecturas y escrituras
✅ **Sin JOINs**: Datos embebidos o referenciados
✅ **Cloud Ready**: MongoDB Atlas gratis

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/logout` - Cerrar sesión
- `GET /api/auth/check` - Verificar sesión

### Ventas
- `POST /api/ventas/create` - Crear venta
- `GET /api/ventas/list` - Listar ventas (con filtros)
- `DELETE /api/ventas/delete?id=<id>` - Eliminar venta

## 🗄️ Estructura de Datos en MongoDB

### Colección: usuarios
```json
{
  "_id": ObjectId("..."),
  "email": "usuario@example.com",
  "password": "$2a$10$...", // Encriptado
  "nombre": "Juan Pérez",
  "createdAt": ISODate("2025-02-12T...")
}
```

### Colección: ventas
```json
{
  "_id": ObjectId("..."),
  "uid": ObjectId("..."), // Referencia a usuario
  "producto": "Laptop HP",
  "cantidad": 2,
  "precioUnit": 500,
  "importe": 1000,
  "moneda": "USD",
  "fecha": ISODate("2025-02-12T..."),
  "fechaISO": "2025-02-12",
  "mes": "2025-02",
  "createdAt": ISODate("2025-02-12T...")
}
```

## 🔧 Comandos Útiles de MongoDB

```bash
# Conectar a MongoDB
mongosh

# Ver bases de datos
show dbs

# Usar base de datos
use registro_ventas

# Ver colecciones
show collections

# Ver usuarios
db.usuarios.find().pretty()

# Ver ventas
db.ventas.find().pretty()

# Contar documentos
db.ventas.countDocuments()

# Eliminar todos los datos (cuidado!)
db.usuarios.deleteMany({})
db.ventas.deleteMany({})
```

## 🐛 Troubleshooting

### MongoDB no inicia
```bash
# Ver logs
sudo journalctl -u mongod

# Reiniciar
sudo systemctl restart mongod

# Verificar puerto
sudo netstat -tulpn | grep 27017
```

### Error: EADDRINUSE (Puerto 3000 ocupado)
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso
sudo lsof -ti:3000 | xargs kill -9
```

### Error de CORS
Verifica que en `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

Y en Angular (auth.service.ts y ventas.service.ts):
```typescript
this.http.post(url, data, { withCredentials: true })
```

### Sesiones no persisten
1. Verifica que MongoDB esté corriendo
2. Verifica `connect-mongo` en package.json
3. Limpia cookies del navegador
4. Verifica que `withCredentials: true` esté en todas las peticiones

## 📦 Dependencias Instaladas

```json
{
  "express": "^4.18.2",        // Framework web
  "mongoose": "^8.0.0",        // ODM para MongoDB
  "cors": "^2.8.5",            // CORS
  "dotenv": "^16.3.1",         // Variables de entorno
  "bcryptjs": "^2.4.3",        // Encriptación
  "express-session": "^1.17.3", // Sesiones
  "connect-mongo": "^5.1.0",   // Store de sesiones
  "nodemon": "^3.0.1"          // Auto-reload (dev)
}
```

## 🚀 Próximos Pasos

1. ✅ Backend Node.js funcionando
2. ✅ MongoDB configurado
3. ✅ Frontend conectado
4. 🔄 Probar todas las funcionalidades
5. 📝 Agregar más validaciones
6. 🔒 Mejorar seguridad (rate limiting, etc.)
7. 📊 Agregar más estadísticas
8. 🌐 Desplegar en producción

## 💡 Consejos

- Usa **MongoDB Compass** para visualizar datos (GUI)
- Instala **Postman** para probar la API
- Usa **nodemon** en desarrollo (auto-reload)
- Revisa logs con `console.log()` o usa **morgan**
- Mantén `.env` fuera de git (ya está en .gitignore)

## 📚 Recursos

- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
