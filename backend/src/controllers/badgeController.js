const db = require('../config/database');

// Obtener insignias del usuario actual
const getUserBadges = (req, res) => {
  try {
    const userId = req.user.id;
    const userBadges = db.badges.filter(b => b.userId === userId);
    
    const badgesWithCourses = userBadges.map(badge => {
      const course = db.courses.find(c => c.id === badge.courseId);
      return {
        ...badge,
        courseTitle: course?.title
      };
    });

    res.json({
      success: true,
      data: badgesWithCourses
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener todas las insignias (admin)
const getAllBadges = (req, res) => {
  try {
    res.json({
      success: true,
      data: db.badges
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUserBadges,
  getAllBadges
};