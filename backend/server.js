require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas
const userRoutes = require('./src/routes/users');
const courseRoutes = require('./src/routes/courses');
const authRoutes = require('./src/routes/auth');
const progressRoutes = require('./src/routes/progress');
const badgeRoutes = require('./src/routes/badges');
const statsRoutes = require('./src/routes/stats');

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/stats', statsRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: '¡Server funcionando!',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      courses: '/api/courses',
      health: '/health'
    }
  });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bienvenido al Portal de Capacitaciones - Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: 'Visita /health para ver endpoints disponibles'
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📚 Courses API: http://localhost:${PORT}/api/courses`);
});