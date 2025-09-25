const express = require('express');
const router = express.Router();
const { updateProgress, getUserProgress } = require('../controllers/progressController');
const { authenticateToken } = require('../middlewares/auth');

// PUT /api/progress/:courseId - Actualizar progreso
router.put('/:courseId', authenticateToken, updateProgress);

// GET /api/progress - Obtener progreso del usuario
router.get('/', authenticateToken, getUserProgress);

module.exports = router;