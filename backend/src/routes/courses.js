const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, getUserCourseProgress } = require('../controllers/courseController');

// GET /api/courses - Obtener todos los cursos
router.get('/', getAllCourses);

// GET /api/courses/:id - Obtener curso por ID
router.get('/:id', getCourseById);

// GET /api/courses/:courseId/progress/:userId - Obtener progreso de usuario en curso
router.get('/:courseId/progress/:userId', getUserCourseProgress);

module.exports = router;