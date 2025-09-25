const express = require('express');
const router = express.Router();
const { getDashboardStats, exportData } = require('../controllers/statsController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// GET /api/stats/dashboard - Estadísticas del dashboard admin
router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats);

// GET /api/stats/export - Exportar datos a CSV
router.get('/export', authenticateToken, requireAdmin, exportData);

module.exports = router;