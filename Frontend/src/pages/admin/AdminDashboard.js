import React, { useState, useEffect } from 'react';


import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalPedidos: 0,
    totalUsuarios: 0,
    ventasTotales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminMenuItems = [

    {
      title: 'Gestión de Productos',
      description: 'Agregar, editar y eliminar productos del catálogo',
      icon: <InventoryIcon />,
      path: '/admin/productos',
      color: 'primary'
    },
    {
      title: 'Pedidos',
      description: 'Ver y gestionar pedidos de clientes',
      icon: <ShoppingCartIcon />,
      path: '/admin/pedidos',
      color: 'secondary'
    },
    {
      title: 'Usuarios',
      description: 'Administrar cuentas de usuarios y administradores',
      icon: <PeopleIcon />,
      path: '/admin/usuarios',
      color: 'success'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes de ventas',
      icon: <BarChartIcon />,
      path: '/admin/reportes',
      color: 'info'
    },
    {
      title: 'Configuración',
      description: 'Configurar ajustes del sistema',
      icon: <SettingsIcon />,
      path: '/admin/configuracion',
      color: 'warning'
    }
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Administración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido, {user?.name || 'Administrador'}. Gestiona tu tienda desde aquí.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas Rápidas
            </Typography>
            {loading ? <Typography>Cargando...</Typography> : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">{stats.totalProductos}</Typography>
                  <Typography variant="body2" color="text.secondary">Productos</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary">{stats.totalPedidos}</Typography>
                  <Typography variant="body2" color="text.secondary">Pedidos</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success">{stats.totalUsuarios}</Typography>
                  <Typography variant="body2" color="text.secondary">Usuarios</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info">{formatCurrency(stats.ventasTotales)}</Typography>
                  <Typography variant="body2" color="text.secondary">Ventas Totales</Typography>
                </Box>
              </Grid>
            </Grid>
            )}
          </Paper>

        </Grid>

        {/* Admin Menu */}
        {adminMenuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: `${item.color}.main`, mb: 2, fontSize: '3rem' }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Button
                  variant="contained"
                  color={item.color}
                  sx={{ mt: 2 }}
                  component={Link}
                  to={item.path}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Actividad Reciente
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="No hay actividad reciente"
              secondary="Las actividades aparecerán aquí cuando gestiones productos o pedidos"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;