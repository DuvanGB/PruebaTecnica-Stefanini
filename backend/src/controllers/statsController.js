const db = require('../config/database');

const getDashboardStats = (req, res) => {
  try {
    console.log('📊 Calculando estadísticas avanzadas...');

    // Estadísticas básicas
    const totalUsers = db.users.length;
    const totalCourses = db.courses.length;
    const totalAdmins = db.users.filter(u => u.role === 'admin').length;
    const totalInstructors = db.users.filter(u => u.role === 'instructor').length;
    
    // Progreso y actividad
    const totalProgress = db.userProgress.length;
    const completedProgress = db.userProgress.filter(up => up.status === 'completed').length;
    const inProgress = db.userProgress.filter(up => up.status === 'in_progress').length;
    const completionRate = totalProgress > 0 ? (completedProgress / totalProgress * 100).toFixed(1) : 0;

    // Cursos más populares (con datos reales)
    const coursePopularity = db.courses.map(course => {
      const enrolled = db.userProgress.filter(up => up.courseId === course.id).length;
      const completed = db.userProgress.filter(up => up.courseId === course.id && up.status === 'completed').length;
      const completionRate = enrolled > 0 ? (completed / enrolled * 100).toFixed(1) : 0;
      
      const instructor = db.users.find(u => u.id === course.instructorId);
      
      return {
        id: course.id,
        title: course.title,
        category: course.category,
        enrolled: enrolled,
        completed: completed,
        completionRate: parseFloat(completionRate),
        instructorName: instructor?.name || 'Instructor no asignado'
      };
    }).sort((a, b) => b.enrolled - a.enrolled);

    // Actividad reciente (últimos 5 eventos)
    const recentActivity = db.userProgress
      .sort((a, b) => new Date(b.lastActivity || b.completedAt || new Date()) - new Date(a.lastActivity || a.completedAt || new Date()))
      .slice(0, 5)
      .map(activity => {
        const user = db.users.find(u => u.id === activity.userId);
        const course = db.courses.find(c => c.id === activity.courseId);
        
        return {
          userName: user?.name || 'Usuario',
          courseTitle: course?.title || 'Curso',
          progress: activity.progress || 0,
          status: activity.status || 'not_started',
          lastActivity: activity.lastActivity || activity.completedAt || new Date()
        };
      });

    // Estadísticas por categoría
    const categoryStats = {};
    db.courses.forEach(course => {
      if (!categoryStats[course.category]) {
        categoryStats[course.category] = { courses: 0, enrolled: 0, completed: 0 };
      }
      categoryStats[course.category].courses++;
      
      const courseProgress = db.userProgress.filter(up => up.courseId === course.id);
      categoryStats[course.category].enrolled += courseProgress.length;
      categoryStats[course.category].completed += courseProgress.filter(up => up.status === 'completed').length;
    });

    console.log('✅ Estadísticas avanzadas calculadas');

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalCourses,
          totalAdmins,
          totalInstructors,
          activeUsers: Math.min(totalUsers, 5), // Simulación
          completionRate: parseFloat(completionRate),
          totalEnrollments: totalProgress
        },
        popularCourses: coursePopularity.slice(0, 5),
        recentActivity,
        categoryStats: Object.entries(categoryStats).map(([category, stats]) => ({
          category,
          ...stats,
          completionRate: stats.enrolled > 0 ? ((stats.completed / stats.enrolled) * 100).toFixed(1) : 0
        }))
      }
    });

  } catch (error) {
    console.error('❌ Error en estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const exportData = (req, res) => {
  try {
    const { type } = req.query;
    
    let data = [];
    let filename = 'export';
    
    switch (type) {
      case 'users':
        data = db.users.map(user => ({
          id: user.id,
          nombre: user.name,
          email: user.email,
          rol: user.role,
          fecha_creacion: user.createdAt
        }));
        filename = 'usuarios';
        break;
        
      case 'courses':
        data = db.courses.map(course => {
          const instructor = db.users.find(u => u.id === course.instructorId);
          const enrolled = db.userProgress.filter(up => up.courseId === course.id).length;
          const completed = db.userProgress.filter(up => up.courseId === course.id && up.status === 'completed').length;
          
          return {
            id: course.id,
            titulo: course.title,
            descripcion: course.description,
            categoria: course.category,
            instructor: instructor?.name,
            inscritos: enrolled,
            completados: completed,
            tasa_completacion: enrolled > 0 ? `${((completed / enrolled) * 100).toFixed(1)}%` : '0%'
          };
        });
        filename = 'cursos';
        break;
        
      default:
        return res.status(400).json({ success: false, message: 'Tipo no válido' });
    }
    
    // Convertir a CSV simple
    const headers = Object.keys(data[0] || {}).join(',');
    const csvData = data.map(row => 
      Object.values(row).map(value => `"${value}"`).join(',')
    );
    const csv = [headers, ...csvData].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
    res.send(csv);
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  exportData
};