import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const ReportsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BarChartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Reportes de Ventas
        </Typography>
      </Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Página en Construcción
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Esta sección mostrará gráficos y estadísticas clave sobre el rendimiento de tu tienda.
          <br />
          Próximamente podrás visualizar reportes de ventas por día/mes, productos más vendidos, y más.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ReportsPage;