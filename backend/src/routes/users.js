const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', authenticateToken, getUserById);

// POST /api/users - Crear nuevo usuario (solo admin)
router.post('/', authenticateToken, requireAdmin, createUser);

module.exports = router;