const express = require('express');
const router = express.Router();
const { getUserBadges, getAllBadges } = require('../controllers/badgeController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// GET /api/badges/my-badges - Insignias del usuario actual
router.get('/my-badges', authenticateToken, getUserBadges);

// GET /api/badges - Todas las insignias (solo admin)
router.get('/', authenticateToken, requireAdmin, getAllBadges);

module.exports = router;