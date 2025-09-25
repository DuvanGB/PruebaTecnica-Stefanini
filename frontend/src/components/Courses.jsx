import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import {
  School,
  PlayArrow,
  CheckCircle,
  Update,
  BarChart
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [progressDialog, setProgressDialog] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/progress');
      setUserProgress(response.data.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseProgress = (courseId) => {
    const progress = userProgress.find(up => up.courseId === courseId);
    return progress || { progress: 0, status: 'not_started' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      default: return 'No iniciado';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'in_progress': return <Update color="warning" />;
      default: return <PlayArrow color="action" />;
    }
  };

  const handleUpdateProgress = (course) => {
    const progress = getCourseProgress(course.id);
    setSelectedCourse(course);
    setCurrentProgress(progress.progress);
    setProgressDialog(true);
  };

  const saveProgress = async () => {
    try {
      const status = currentProgress === 100 ? 'completed' : 
                    currentProgress > 0 ? 'in_progress' : 'not_started';

      await axios.put(`/progress/${selectedCourse.id}`, {
        progress: currentProgress,
        status: status
      });

      await fetchUserProgress();
      setProgressDialog(false);
      
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Estadísticas rápidas
  const enrolledCourses = userProgress.length;
  const completedCourses = userProgress.filter(up => up.status === 'completed').length;
  const inProgressCourses = userProgress.filter(up => up.status === 'in_progress').length;
  const completionRate = enrolledCourses > 0 ? Math.round((completedCourses / enrolledCourses) * 100) : 0;

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>Cargando catálogo de cursos...</Typography>
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
            📚 Catálogo de Cursos
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Explora y gestiona tu progreso de aprendizaje
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            startIcon={<School />}
          >
            Vista Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
            startIcon={<BarChart />}
          >
            Vista Lista
          </Button>
        </Box>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary" gutterBottom>
                {courses.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cursos Disponibles
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PlayArrow color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning" gutterBottom>
                {enrolledCourses}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cursos Inscritos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success" gutterBottom>
                {completedCourses}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Completados
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Update color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info" gutterBottom>
                {completionRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tasa de Finalización
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Vista de Grid */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {courses.map((course) => {
            const progress = getCourseProgress(course.id);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={course.category} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                      {getStatusIcon(progress.status)}
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ 
                      minHeight: '64px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {course.title}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      mb: 2,
                      minHeight: '40px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {course.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" display="block" color="textSecondary">
                        Instructor: {course.instructorName}
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {course.modules} módulos • {course.duration}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          Progreso
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {progress.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress.progress} 
                        sx={{ height: 8, borderRadius: 4 }}
                        color={getStatusColor(progress.status)}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={getStatusText(progress.status)} 
                        size="small" 
                        color={getStatusColor(progress.status)}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {progress.progress}% completado
                      </Typography>
                    </Box>

                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleUpdateProgress(course)}
                      startIcon={getStatusIcon(progress.status)}
                      color={progress.status === 'completed' ? 'success' : 'primary'}
                    >
                      {progress.status === 'completed' ? 'Ver Curso' : 
                       progress.status === 'in_progress' ? 'Continuar' : 'Comenzar Ahora'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Vista de Lista */}
      {viewMode === 'list' && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChart sx={{ mr: 1 }} /> Lista de Cursos
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Curso</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Instructor</TableCell>
                    <TableCell>Progreso</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => {
                    const progress = getCourseProgress(course.id);
                    
                    return (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Typography fontWeight="bold">{course.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {course.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={course.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{course.instructorName}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={progress.progress} 
                              sx={{ width: 100, mr: 1 }}
                              color={getStatusColor(progress.status)}
                            />
                            {progress.progress}%
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(progress.status)} 
                            size="small"
                            color={getStatusColor(progress.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleUpdateProgress(course)}
                            startIcon={getStatusIcon(progress.status)}
                          >
                            {progress.status === 'completed' ? 'Ver' : 
                             progress.status === 'in_progress' ? 'Continuar' : 'Comenzar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay cursos */}
      {courses.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          No hay cursos disponibles en este momento. Por favor, contacta al administrador del sistema.
        </Alert>
      )}

      {/* Dialog para actualizar progreso */}
      <Dialog open={progressDialog} onClose={() => setProgressDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Update sx={{ mr: 1 }} /> Actualizar Progreso: {selectedCourse?.title}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Marca tu progreso actual en este curso:
          </Typography>
          <Box sx={{ mt: 3, mb: 3 }}>
            <Slider
              value={currentProgress}
              onChange={(e, newValue) => setCurrentProgress(newValue)}
              aria-labelledby="progress-slider"
              valueLabelDisplay="on"
              valueLabelFormat={(value) => `${value}%`}
              step={10}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' }
              ]}
              min={0}
              max={100}
              sx={{ mt: 4 }}
            />
          </Box>
          <Alert 
            severity={
              currentProgress === 100 ? 'success' : 
              currentProgress >= 50 ? 'info' : 'warning'
            }
          >
            {currentProgress === 100 ? '🎉 ¡Curso completado! Felicitaciones!' : 
             currentProgress >= 50 ? '💪 ¡Vas por la mitad! Sigue así!' : 
             '👏 ¡Sigue adelante! Cada paso cuenta.'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialog(false)}>Cancelar</Button>
          <Button onClick={saveProgress} variant="contained" startIcon={<CheckCircle />}>
            Guardar Progreso
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;