const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { JWT_SECRET } = require('../middlewares/auth');

// Simulamos contraseñas hasheadas (en desarrollo)
const hashedPasswords = {
  'admin@example.com': '$2a$10$exampleHashForAdmin',
  'instructor@example.com': '$2a$10$exampleHashForInstructor', 
  'user@example.com': '$2a$10$exampleHashForUser'
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario en la base de datos
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // En un entorno real, verificaríamos la contraseña con bcrypt
    // const validPassword = await bcrypt.compare(password, user.passwordHash);
    // Por ahora, simulamos la verificación
    const validPassword = password === 'password123'; // Contraseña simple para desarrollo

    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verificar token actual
const verifyToken = (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
};

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { email, name, password, role = 'user' } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, nombre y contraseña son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario ya existe' 
      });
    }

    // Hash de la contraseña (simulado)
    // const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: db.users.length + 1,
      email,
      name,
      role,
      createdAt: new Date()
    };

    db.users.push(newUser);

    // Generar token automáticamente después del registro
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        name: newUser.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  login,
  register,
  verifyToken
};