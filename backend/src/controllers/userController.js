const db = require('../config/database');

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
  try {
    res.json({
      success: true,
      data: db.users,
      count: db.users.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener usuario por ID
const getUserById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    // Obtener progreso del usuario
    const userProgress = db.userProgress.filter(up => up.userId === userId);
    const userBadges = db.badges.filter(b => b.userId === userId);
    
    res.json({
      success: true,
      data: {
        ...user,
        progress: userProgress,
        badges: userBadges
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear nuevo usuario (simulado)
const createUser = (req, res) => {
  try {
    const { email, name, role = 'user' } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Email y nombre son requeridos' });
    }
    
    const newUser = {
      id: db.users.length + 1,
      email,
      name,
      role,
      createdAt: new Date()
    };
    
    db.users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser
};