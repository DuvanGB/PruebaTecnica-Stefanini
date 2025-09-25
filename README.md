# 🚀 Portal de Capacitaciones Interactivo

## 📋 Descripción
Plataforma robusta y escalable para la gestión de capacitaciones internas y externas con autenticación avanzada, sistema de progreso e insignias digitales.

## 🏗️ Arquitectura del Sistema

### Frontend
- **React 18** + Vite
- **Material-UI** para componentes
- **React Router** para navegación
- **Axios** para consumo de APIs

### Backend  
- **Node.js** + Express.js
- **JWT** para autenticación
- **CORS** habilitado
- **Base de datos** en memoria (para desarrollo)

### Contenedores
- **Docker** + Docker Compose
- **Multi-stage builds** para optimización

## 🚀 Despliegue Rápido

### Prerrequisitos
- Docker 20.10+
- Docker Compose 2.0+

### Ejecutar con Docker
```bash
# Clonar el proyecto
git clone <repository-url>
cd portal-capacitaciones

# Construir y ejecutar
docker-compose up --build

# Acceder a la aplicación:
# Frontend: http://localhost:5174
# Backend API: http://localhost:3001
```

### Credenciales de Prueba
- **Administrador**: admin@example.com / password123
- **Instructor**: instructor@example.com / password123  
- **Usuario**: user@example.com / password123

## 📁 Estructura del Proyecto

```
portal-capacitaciones/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── routes/          # Definición de endpoints
│   │   ├── models/          # Modelos de datos
│   │   ├── config/          # Configuración
│   │   ├── middlewares/     # Autenticación y validación
│   │   └── services/        # Lógica reusable
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Estado global (Auth)
│   │   ├── pages/           # Vistas principales
│   │   └── App.jsx          # Componente principal
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token

### Gestión de Cursos
- `GET /api/courses` - Listar todos los cursos
- `GET /api/courses/:id` - Obtener curso específico

### Progreso de Usuarios
- `GET /api/progress` - Obtener progreso del usuario
- `PUT /api/progress/:courseId` - Actualizar progreso

### Dashboard Administrativo
- `GET /api/stats/dashboard` - Estadísticas (admin only)
- `GET /api/stats/export` - Exportar datos CSV (admin only)

## 🐳 Dockerización

### Backend Container
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Frontend Container  
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 🛠️ Desarrollo Local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend  
npm install
npm run dev
```

## ✅ Funcionalidades Implementadas

- [x] **Autenticación JWT** con roles (admin, instructor, usuario)
- [x] **CRUD completo** de cursos y usuarios
- [x] **Sistema de progreso** (iniciado, en progreso, completado)
- [x] **Insignias digitales** automáticas
- [x] **Dashboard administrativo** con métricas
- [x] **Exportación de datos** a CSV
- [x] **Interfaz responsive** con Material-UI
- [x] **Dockerización completa**
- [x] **API REST documentada**

## 🚀 Próximas Mejoras

- [ ] Base de datos PostgreSQL real
- [ ] Autenticación OAuth2 (Google, Azure AD)
- [ ] Notificaciones por email (AWS SES)
- [ ] Tests unitarios e integración
- [ ] Despliegue en AWS EKS
- [ ] Sistema de archivos con AWS S3

## 👨‍💻 Desarrollo

### Convenciones de Código
- **Components**: PascalCase (Login.jsx, Dashboard.jsx)
- **Variables**: camelCase (userProgress, courseList)
- **Constants**: UPPER_CASE (API_URL, JWT_SECRET)

### Estructura de Commits
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Documentación
- `refactor`: Refactorización de código

## 📞 Soporte

Para issues y preguntas, contactar al equipo de desarrollo o crear un issue en el repositorio.

---

**¡Desarrollado con ❤️ para el CoE de Desarrollo!**
