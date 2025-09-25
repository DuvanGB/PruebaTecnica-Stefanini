const db = require('../config/database');

// Actualizar progreso de un curso
const updateProgress = (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, status } = req.body;
    const userId = req.user.id;

    // Buscar progreso existente
    let userProgress = db.userProgress.find(up => 
      up.userId === userId && up.courseId === parseInt(courseId)
    );

    if (userProgress) {
      // Actualizar existente
      userProgress.progress = progress;
      userProgress.status = status;
      userProgress.lastActivity = new Date();
      
      if (status === 'completed') {
        userProgress.completedAt = new Date();
        
        // Asignar insignia automáticamente al completar
        const newBadge = {
          id: db.badges.length + 1,
          userId: userId,
          badgeName: `Completado: ${db.courses.find(c => c.id === parseInt(courseId))?.title}`,
          courseId: parseInt(courseId),
          earnedAt: new Date()
        };
        db.badges.push(newBadge);
      }
    } else {
      // Crear nuevo progreso
      const newProgress = {
        id: db.userProgress.length + 1,
        userId: userId,
        courseId: parseInt(courseId),
        progress: progress,
        status: status,
        lastActivity: new Date(),
        completedAt: status === 'completed' ? new Date() : null
      };
      db.userProgress.push(newProgress);
    }

    res.json({
      success: true,
      message: 'Progreso actualizado correctamente'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener progreso del usuario actual
const getUserProgress = (req, res) => {
  try {
    const userId = req.user.id;
    const progress = db.userProgress.filter(up => up.userId === userId);
    
    const progressWithCourses = progress.map(p => {
      const course = db.courses.find(c => c.id === p.courseId);
      return {
        ...p,
        courseTitle: course?.title,
        courseCategory: course?.category
      };
    });

    res.json({
      success: true,
      data: progressWithCourses
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  updateProgress,
  getUserProgress
};