const express = require('express');
const router = express.Router();
const { login, register, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

// POST /api/auth/login - Login de usuario
router.post('/login', login);

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// GET /api/auth/verify - Verificar token actual
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;