import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  useTheme
} from '@mui/material';
import { 
  BarChart, 
  TrendingUp, 
  PieChart, 
  CalendarToday,
  Timeline,
  Analytics,
  Construction
} from '@mui/icons-material';

const ReportsPage = () => {
  const theme = useTheme();

  const upcomingFeatures = [
    { icon: <BarChart />, text: 'Reportes de ventas por período' },
    { icon: <TrendingUp />, text: 'Tendencias y análisis predictivo' },
    { icon: <PieChart />, text: 'Distribución por categorías' },
    { icon: <CalendarToday />, text: 'Comparativos mensuales/anuales' },
    { icon: <Timeline />, text: 'Métricas de crecimiento' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        borderRadius: 2,
        p: 3,
        color: 'white'
      }}>
        <Analytics sx={{ fontSize: 48, mr: 3 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom color='#fff'>
            Centro de Análisis
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }} color='#fff'>
            Insights y métricas para optimizar tu negocio
          </Typography>
        </Box>
      </Box>

      {/* Progress Indicator */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="primary" fontWeight="medium">
            Desarrollo en progreso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            65%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={65} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            }
          }} 
        />
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: theme.palette.background.default
            }}
          >
            <Construction 
              sx={{ 
                fontSize: 64, 
                color: theme.palette.primary.main,
                mb: 2
              }} 
            />
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Próximamente: Panel de Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Estamos desarrollando una suite completa de análisis para ayudarte a tomar 
              decisiones basadas en datos. Podrás visualizar el rendimiento de tu tienda 
              con métricas clave y reportes detallados.
            </Typography>
            
            <Chip 
              icon={<Timeline />} 
              label="Disponible en: 2-3 semanas" 
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 'medium' }}
            />
          </Paper>
        </Grid>

        {/* Upcoming Features */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Características Incluidas
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {upcomingFeatures.map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.grey[50],
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ color: theme.palette.primary.main, mr: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          ¿Tienes sugerencias para esta sección?{' '}
          <Typography 
            component="span" 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Comparte tu feedback
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default ReportsPage;