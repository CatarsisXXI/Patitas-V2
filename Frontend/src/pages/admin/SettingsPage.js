import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Configuración del Sistema
        </Typography>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Página en Construcción
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí podrás configurar aspectos generales de la tienda.
          <br />
          Próximamente podrás ajustar opciones como costos de envío, impuestos, o integrar servicios de pago.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SettingsPage;