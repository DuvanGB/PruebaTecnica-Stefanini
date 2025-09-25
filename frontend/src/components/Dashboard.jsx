import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  School,
  Person,
  MilitaryTech,
  TrendingUp,
  Explore,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    badges: 0,
    totalProgress: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressResponse, badgesResponse, coursesResponse] = await Promise.all([
        axios.get('/progress'),
        axios.get('/badges/my-badges'),
        axios.get('/courses')
      ]);

      const progress = progressResponse.data.data;
      const badges = badgesResponse.data.data;
      const courses = coursesResponse.data.data;

      const completed = progress.filter(p => p.status === 'completed').length;
      const inProgress = progress.filter(p => p.status === 'in_progress').length;
      const totalProgress = progress.length > 0
        ? progress.reduce((sum, p) => sum + p.progress, 0) / progress.length
        : 0;

      setStats({
        completed,
        inProgress,
        badges: badges.length,
        totalProgress: Math.round(totalProgress)
      });

      const recent = progress
        .sort((a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0))
        .slice(0, 3)
        .map(p => {
          const course = courses.find(c => c.id === p.courseId);
          return {
            ...p,
            courseTitle: course?.title,
            courseCategory: course?.category,
            statusText:
              p.status === 'completed'
                ? 'Completado'
                : p.status === 'in_progress'
                ? 'En progreso'
                : 'No iniciado'
          };
        });

      setRecentCourses(recent);
      setRecentActivity(recent.slice(0, 2));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>Cargando dashboard...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            📊 Dashboard Personal
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Bienvenido, {user?.name} • Rol: {user?.role}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Explore />}
          onClick={() => navigate('/courses')}
        >
          Explorar Cursos
        </Button>
      </Box>

      {/* Barra de progreso general */}
      <Card sx={{
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Progreso General de Aprendizaje</Typography>
            <Typography variant="h5">{stats.totalProgress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.totalProgress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
                borderRadius: 6
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">Inicio</Typography>
            <Typography variant="caption">Meta: 100%</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Contenido principal */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            {/* Cursos recientes */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1 }} /> Mis Cursos Recientes
                  </Typography>
                  {recentCourses.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Curso</TableCell>
                            <TableCell>Progreso</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acción</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentCourses.map((course, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography fontWeight="bold">{course.courseTitle}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {course.courseCategory}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={course.progress}
                                    sx={{ width: 100, mr: 1 }}
                                    color={getStatusColor(course.status)}
                                  />
                                  {course.progress}%
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={course.statusText}
                                  size="small"
                                  color={getStatusColor(course.status)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate('/courses')}
                                >
                                  {course.status === 'completed' ? 'Ver' : 'Continuar'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        Aún no has comenzado ningún curso
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/courses')}
                        startIcon={<Explore />}
                      >
                        Explorar Cursos Disponibles
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Actividad reciente */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>📈 Actividad Reciente</Typography>
                  {recentActivity.length > 0 ? (
                    <Box>
                      {recentActivity.map((activity, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 2,
                            pb: 2,
                            borderBottom: index < recentActivity.length - 1 ? '1px solid #eee' : 'none'
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {activity.courseTitle}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={activity.progress}
                              sx={{ flexGrow: 1, mr: 1 }}
                              color={getStatusColor(activity.status)}
                            />
                            <Typography variant="caption">{activity.progress}%</Typography>
                          </Box>
                          <Chip
                            label={activity.statusText}
                            size="small"
                            sx={{ mt: 1 }}
                            color={getStatusColor(activity.status)}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No hay actividad reciente
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={5}>
          {/* Acciones rápidas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🚀 Acciones Rápidas</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/courses')}
                  startIcon={<Explore />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Explorar Cursos
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                  startIcon={<Person />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Mi Perfil
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/admin')}
                    startIcon={<AdminPanelSettings />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Panel de Admin
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Estadísticas principales */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Card sx={{ flex: 1, textAlign: 'center' }}>
              <CardContent>
                <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="primary">
                  {stats.completed + stats.inProgress}
                </Typography>
                <Typography variant="body2" color="textSecondary">Inscritos</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'center' }}>
              <CardContent>
                <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="success">{stats.completed}</Typography>
                <Typography variant="body2" color="textSecondary">Completados</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'center' }}>
              <CardContent>
                <Person color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="warning">{stats.inProgress}</Typography>
                <Typography variant="body2" color="textSecondary">En Progreso</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'center' }}>
              <CardContent>
                <MilitaryTech color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="secondary">{stats.badges}</Typography>
                <Typography variant="body2" color="textSecondary">Insignias</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Panel admin */}
      {user?.role === 'admin' && (
        <Card
          sx={{
            mt: 4,
            border: '2px solid',
            borderColor: 'secondary.main',
            background: 'rgba(220, 0, 78, 0.02)'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminPanelSettings sx={{ mr: 1 }} /> Acceso de Administrador
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Gestiona usuarios, cursos y visualiza reportes del sistema
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/admin')}
                startIcon={<AdminPanelSettings />}
                size="large"
              >
                Ir al Panel Admin
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;
