// Datos de ejemplo para usuarios
const users = [
  { 
    id: 1, 
    email: 'admin@example.com', 
    name: 'Administrador', 
    role: 'admin',
    createdAt: new Date()
  },
  { 
    id: 2, 
    email: 'instructor@example.com', 
    name: 'Instructor Principal', 
    role: 'instructor',
    createdAt: new Date()
  },
  { 
    id: 3, 
    email: 'user@example.com', 
    name: 'Usuario Demo', 
    role: 'user',
    createdAt: new Date()
  }
];

// Datos de ejemplo para cursos
const courses = [
  { 
    id: 1, 
    title: 'Introducción a React', 
    description: 'Curso básico de React desde cero', 
    category: 'Frontend',
    instructorId: 2,
    modules: 5,
    duration: '10 horas',
    createdAt: new Date()
  },
  { 
    id: 2, 
    title: 'Node.js Avanzado', 
    description: 'Curso avanzado de Node.js y Express', 
    category: 'Backend',
    instructorId: 2,
    modules: 8,
    duration: '15 horas',
    createdAt: new Date()
  },
  { 
    id: 3, 
    title: 'AWS Fundamentals', 
    description: 'Conceptos básicos de Amazon Web Services', 
    category: 'Cloud',
    instructorId: 2,
    modules: 6,
    duration: '12 horas',
    createdAt: new Date()
  }
];

// Progreso de usuarios en cursos
const userProgress = [
  { id: 1, userId: 3, courseId: 1, status: 'in_progress', progress: 60, lastActivity: new Date() },
  { id: 2, userId: 3, courseId: 2, status: 'not_started', progress: 0 },
  { id: 3, userId: 3, courseId: 3, status: 'completed', progress: 100, completedAt: new Date() }
];

// Insignias de usuarios
const badges = [
  { userId: 3, badgeName: 'Primer Curso', courseId: 3, earnedAt: new Date() }
];

// Exportar
module.exports = {
  users,
  courses,
  userProgress,
  badges
};