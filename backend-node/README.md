# Backend Node.js + Express + MongoDB

Sistema de registro de ventas con autenticación y gestión de ventas en múltiples monedas.

## 🚀 Instalación

### 1. Instalar dependencias
```bash
cd backend-node
npm install
```

### 2. Configurar MongoDB

#### Opción A: MongoDB Local
```bash
# Instalar MongoDB en Ubuntu/Debian
sudo apt-get install mongodb

# Iniciar servicio
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verificar que está corriendo
sudo systemctl status mongodb
```

#### Opción B: MongoDB Atlas (Nube - Gratis)
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster
4. Obtén tu connection string
5. Actualiza `MONGODB_URI` en `.env`

### 3. Configurar variables de entorno
Edita el archivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/registro_ventas
SESSION_SECRET=cambiar_por_algo_seguro
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

### 4. Iniciar servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

## 📁 Estructura del Proyecto

```
backend-node/
├── controllers/          # Lógica de negocio
│   ├── authController.js
│   └── ventasController.js
├── middleware/           # Middleware personalizado
│   └── auth.js
├── models/              # Modelos de MongoDB
│   ├── Usuario.js
│   └── Venta.js
├── routes/              # Definición de rutas
│   ├── auth.js
│   └── ventas.js
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
├── README.md
└── server.js            # Punto de entrada
```

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar nuevo usuario
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Nombre Usuario"
}
```

#### POST `/api/auth/login`
Iniciar sesión
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

#### GET `/api/auth/logout`
Cerrar sesión

#### GET `/api/auth/check`
Verificar sesión activa

### Ventas (Requieren autenticación)

#### POST `/api/ventas/create`
Crear nueva venta
```json
{
  "producto": "Producto A",
  "cantidad": 5,
  "precioUnit": 100.50,
  "fecha": "2025-02-12",
  "moneda": "USD"
}
```

#### GET `/api/ventas/list`
Listar ventas con filtros opcionales
- `?filter=all` - Todas las ventas
- `?filter=day&value=2025-02-12` - Por día
- `?filter=month&value=2025-02` - Por mes
- `?filter=currency&value=USD` - Por moneda

#### DELETE `/api/ventas/delete?id=<id>`
Eliminar venta por ID

## 🗄️ Modelos de Datos

### Usuario
```javascript
{
  email: String (único, requerido),
  password: String (encriptado, requerido),
  nombre: String,
  createdAt: Date
}
```

### Venta
```javascript
{
  uid: ObjectId (referencia a Usuario),
  producto: String (requerido),
  cantidad: Number (requerido, min: 1),
  precioUnit: Number (requerido, min: 0),
  importe: Number (calculado),
  moneda: String (USD, EUR, MXN, etc.),
  fecha: Date,
  fechaISO: String (YYYY-MM-DD),
  mes: String (YYYY-MM),
  createdAt: Date
}
```

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Sesiones seguras con express-session
- ✅ CORS configurado
- ✅ Validación de datos
- ✅ Middleware de autenticación

## 🧪 Probar la API

### Con curl:
```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","nombre":"Test"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  -c cookies.txt

# Crear venta (usando cookies de sesión)
curl -X POST http://localhost:3000/api/ventas/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"producto":"Test","cantidad":1,"precioUnit":100,"fecha":"2025-02-12","moneda":"USD"}'
```

### Con Postman:
1. Importa las rutas
2. Habilita "Send cookies" en la configuración
3. Prueba los endpoints

## 🔧 Troubleshooting

### Error: Cannot connect to MongoDB
```bash
# Verificar que MongoDB está corriendo
sudo systemctl status mongodb

# Reiniciar MongoDB
sudo systemctl restart mongodb
```

### Error: Port 3000 already in use
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: Session not persisting
- Verifica que CORS esté configurado con `credentials: true`
- Verifica que el frontend envíe `withCredentials: true`

## 📦 Dependencias

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno
- **bcryptjs**: Encriptación de contraseñas
- **express-session**: Manejo de sesiones
- **connect-mongo**: Store de sesiones en MongoDB

## 🚀 Despliegue

### Heroku
```bash
heroku create mi-app-ventas
heroku addons:create mongolab
git push heroku main
```

### Railway
1. Conecta tu repositorio
2. Agrega MongoDB addon
3. Configura variables de entorno
4. Deploy automático

## 📝 Notas

- Las sesiones expiran después de 7 días
- Las contraseñas se encriptan con bcrypt (10 rounds)
- Los IDs de MongoDB son ObjectId (24 caracteres hex)
- Las fechas se almacenan en formato ISO
