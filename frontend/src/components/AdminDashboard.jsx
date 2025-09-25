import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  People,
  School,
  TrendingUp,
  Download,
  Category
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/stats/dashboard');
      setStats(response.data.data);
    } catch (error) {
      setError('Error cargando estadísticas: ' + (error.response?.data?.message || error.message));
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await axios.get(`/stats/export?type=${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar datos: ' + error.message);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        🔐 No tienes permisos de administrador para acceder a esta página.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>Cargando dashboard administrativo...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
        <Button onClick={fetchStats} sx={{ ml: 2 }} size="small">
          Reintentar
        </Button>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No se pudieron cargar las estadísticas.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          ⚙️ Panel de Administración
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport('users')} size="small">
            Usuarios CSV
          </Button>
          <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport('courses')} size="small">
            Cursos CSV
          </Button>
        </Box>
      </Box>

      {/* Navegación por tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant={activeTab === 'summary' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('summary')}
            startIcon={<TrendingUp />}
          >
            Resumen
          </Button>
          <Button 
            variant={activeTab === 'courses' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('courses')}
            startIcon={<School />}
          >
            Cursos
          </Button>
          <Button 
            variant={activeTab === 'categories' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('categories')}
            startIcon={<Category />}
          >
            Categorías
          </Button>
        </Box>
      </Box>

      {/* Resumen General */}
      {activeTab === 'summary' && (
        <Box>
          <Typography variant="h5" gutterBottom>📊 Resumen General</Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Card sx={{ minWidth: 200, flexGrow: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Usuarios</Typography>
                </Box>
                <Typography variant="h3" color="primary" gutterBottom>
                  {stats.summary.totalUsers}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.summary.totalAdmins} admins • {stats.summary.totalInstructors} instructores
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ minWidth: 200, flexGrow: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Cursos</Typography>
                </Box>
                <Typography variant="h3" color="secondary" gutterBottom>
                  {stats.summary.totalCourses}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.summary.totalEnrollments} inscripciones totales
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ minWidth: 200, flexGrow: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Finalización</Typography>
                </Box>
                <Typography variant="h3" color="success" gutterBottom>
                  {stats.summary.completionRate}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.summary.completionRate} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Actividad Reciente */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🔄 Actividad Reciente</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Curso</TableCell>
                      <TableCell>Progreso</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentActivity.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>{activity.userName}</TableCell>
                        <TableCell>{activity.courseTitle}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={activity.progress} 
                              sx={{ width: 100, mr: 1 }}
                              color={activity.status === 'completed' ? 'success' : 'primary'}
                            />
                            {activity.progress}%
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={activity.status} 
                            size="small"
                            color={
                              activity.status === 'completed' ? 'success' :
                              activity.status === 'in_progress' ? 'warning' : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Cursos Populares */}
      {activeTab === 'courses' && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>🏆 Cursos Más Populares</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Curso</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Inscritos</TableCell>
                    <TableCell>Completados</TableCell>
                    <TableCell>Tasa de Éxito</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.popularCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Typography fontWeight="bold">{course.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          por {course.instructorName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={course.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{course.enrolled}</TableCell>
                      <TableCell>{course.completed}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={course.completionRate} 
                            sx={{ flexGrow: 1, mr: 1 }}
                            color={course.completionRate > 70 ? 'success' : 'warning'}
                          />
                          {course.completionRate}%
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas por Categoría */}
      {activeTab === 'categories' && stats.categoryStats && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>🏷️ Estadísticas por Categoría</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Cursos</TableCell>
                    <TableCell>Inscripciones</TableCell>
                    <TableCell>Completados</TableCell>
                    <TableCell>Tasa de Finalización</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.categoryStats.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip label={category.category} color="primary" />
                      </TableCell>
                      <TableCell>{category.courses}</TableCell>
                      <TableCell>{category.enrolled}</TableCell>
                      <TableCell>{category.completed}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={parseFloat(category.completionRate)} 
                            sx={{ flexGrow: 1, mr: 1 }}
                          />
                          {category.completionRate}%
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdminDashboard;