const db = require('../config/database');

// Obtener todos los cursos
const getAllCourses = (req, res) => {
  try {
    const coursesWithInstructor = db.courses.map(course => {
      const instructor = db.users.find(u => u.id === course.instructorId);
      return {
        ...course,
        instructorName: instructor ? instructor.name : 'Instructor no disponible'
      };
    });
    
    res.json({
      success: true,
      data: coursesWithInstructor,
      count: coursesWithInstructor.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener curso por ID
const getCourseById = (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = db.courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    }
    
    const instructor = db.users.find(u => u.id === course.instructorId);
    const enrolledUsers = db.userProgress.filter(up => up.courseId === courseId);
    
    res.json({
      success: true,
      data: {
        ...course,
        instructorName: instructor ? instructor.name : 'Instructor no disponible',
        enrolledCount: enrolledUsers.length,
        completionRate: enrolledUsers.length > 0 ? 
          (enrolledUsers.filter(u => u.status === 'completed').length / enrolledUsers.length * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener progreso de usuario en un curso
const getUserCourseProgress = (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const courseId = parseInt(req.params.courseId);
    
    const progress = db.userProgress.find(up => up.userId === userId && up.courseId === courseId);
    
    if (!progress) {
      return res.status(404).json({ 
        success: false, 
        message: 'Progreso no encontrado',
        data: { status: 'not_started', progress: 0 }
      });
    }
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getUserCourseProgress
};