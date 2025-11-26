import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Build as BuildIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Receipt as TaxIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon
} from '@mui/icons-material';

const SettingsPage = () => {
  // Datos de ejemplo para las funcionalidades próximas
  const upcomingFeatures = [
    { icon: <PaymentIcon />, name: 'Pasarelas de Pago', description: 'Configura métodos de pago como PayPal, Stripe y tarjetas de crédito', status: 'Próximamente' },
    { icon: <ShippingIcon />, name: 'Gestión de Envíos', description: 'Define costos de envío, zonas y proveedores logísticos', status: 'Próximamente' },
    { icon: <TaxIcon />, name: 'Impuestos', description: 'Configura tasas impositivas y reglas fiscales', status: 'Próximamente' },
    { icon: <NotificationsIcon />, name: 'Notificaciones', description: 'Personaliza alertas y comunicaciones con clientes', status: 'Próximamente' },
    { icon: <SecurityIcon />, name: 'Seguridad', description: 'Gestiona permisos y configuraciones de seguridad', status: 'Próximamente' },
    { icon: <ThemeIcon />, name: 'Apariencia', description: 'Personaliza colores y diseño de tu tienda', status: 'Próximamente' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header mejorado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            mr: 3,
            boxShadow: 2
          }}
        >
          <SettingsIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
            Configuración del Sistema
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona todas las configuraciones de tu tienda en un solo lugar
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Panel de estado */}
        <Grid item xs={12}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                <strong>Panel en desarrollo</strong> - Estamos trabajando para brindarte la mejor experiencia
              </Typography>
              <Chip 
                label="Progreso: 25%" 
                color="primary" 
                variant="outlined"
                size="small"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={25} 
              sx={{ mt: 1, height: 6, borderRadius: 3 }}
            />
          </Alert>
        </Grid>

        {/* Funcionalidades actuales (placeholder) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BuildIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight="600">
                  Configuraciones Básicas
                </Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Información de la Tienda" 
                    secondary="Completa en un 100%" 
                  />
                  <Chip label="Activo" color="success" size="small" />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Perfil de Negocio" 
                    secondary="Completa en un 80%" 
                  />
                  <Chip label="Activo" color="success" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel principal de próximas características */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              boxShadow: 3
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              fontWeight="600"
              sx={{ mb: 3 }}
            >
              Próximas Funcionalidades
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              Estamos desarrollando herramientas poderosas para ayudarte a gestionar 
              cada aspecto de tu negocio. Estas características estarán disponibles pronto.
            </Typography>

            <Grid container spacing={3}>
              {upcomingFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {feature.icon}
                        </ListItemIcon>
                        <Typography variant="h6" fontSize="1rem" fontWeight="600">
                          {feature.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {feature.description}
                      </Typography>
                      <Chip 
                        label={feature.status} 
                        color="primary" 
                        variant="filled"
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box 
              sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ¿Tienes sugerencias para nuevas funcionalidades?{' '}
                <Typography 
                  component="span" 
                  color="primary" 
                  fontWeight="600"
                  sx={{ cursor: 'pointer' }}
                >
                  Contáctanos
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage;