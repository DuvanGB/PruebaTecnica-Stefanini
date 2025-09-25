import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Grid
} from '@mui/material';
import { 
  Email, 
  Person, 
  School, 
  MilitaryTech 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [progressResponse, badgesResponse] = await Promise.all([
        axios.get('/progress'),
        axios.get('/badges/my-badges')
      ]);

      setProgress(progressResponse.data.data);
      setBadges(badgesResponse.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En progreso';
      default: return 'No iniciado';
    }
  };

  if (loading) {
    return <Typography>Cargando perfil...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        👤 Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h6" gutterBottom>
                {user?.name}
              </Typography>
              
              <Chip 
                label={user?.role} 
                color="primary" 
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 18 }} /> {user?.email}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, fontSize: 18 }} /> Usuario Activo
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Mis Estadísticas
              </Typography>
              <Typography variant="body2">
                • Cursos completados: {progress.filter(p => p.status === 'completed').length}
                <br/>
                • Cursos en progreso: {progress.filter(p => p.status === 'in_progress').length}
                <br/>
                • Insignias obtenidas: {badges.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} /> Progreso de Cursos
              </Typography>
              
              {progress.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  Aún no has comenzado ningún curso. ¡Empieza ahora!
                </Typography>
              ) : (
                progress.map((item, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.courseTitle}
                      </Typography>
                      <Typography variant="body2">{item.progress}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.progress} 
                      sx={{ mb: 1, height: 10, borderRadius: 5 }}
                      color={getStatusColor(item.status)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Chip 
                        label={getStatusText(item.status)} 
                        size="small" 
                        color={getStatusColor(item.status)}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {item.courseCategory}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MilitaryTech sx={{ mr: 1 }} /> Insignias Obtenidas
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {badges.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    Aún no has obtenido insignias. ¡Completa cursos para ganarlas!
                  </Typography>
                ) : (
                  badges.map((badge, index) => (
                    <Chip
                      key={index}
                      icon={<MilitaryTech />}
                      label={badge.badgeName}
                      color="secondary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;