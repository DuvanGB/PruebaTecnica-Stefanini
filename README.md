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
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
