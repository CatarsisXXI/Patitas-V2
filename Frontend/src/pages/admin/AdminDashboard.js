import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Skeleton,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Inventory,
  ShoppingCart,
  People,
  BarChart,
  Settings,
  TrendingUp,
  Security,
  Dashboard as DashboardIcon,
  Visibility,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalPedidos: 0,
    totalUsuarios: 0,
    ventasTotales: 0
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

  const StatCard = ({ title, value, subtitle, icon, color, loading, prefix = "" }) => (
    <Card 
      sx={{ 
        height: '140px',
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.08)} 0%, ${alpha(theme.palette[color].main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.12)}`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette[color].main}, ${alpha(theme.palette[color].main, 0.7)})`
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" component="div" fontWeight="800" color={`${color}.main`} sx={{ mb: 1 }}>
            {loading ? <Skeleton width={80} /> : `${prefix}${value}`}
          </Typography>
          <Typography variant="h6" component="div" fontWeight="600" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {subtitle}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: `${color}.main`,
            width: 56,
            height: 56,
            ml: 2
          }}
        >
          {icon}
        </Avatar>
      </CardContent>
    </Card>
  );

  const adminMenuItems = [
    {
      title: 'Gestión de Productos',
      description: 'Agregar, editar y eliminar productos del catálogo',
      icon: <Inventory fontSize="medium" />,
      path: '/admin/productos',
      color: 'primary'
    },
    {
      title: 'Pedidos',
      description: 'Ver y gestionar pedidos de clientes',
      icon: <ShoppingCart fontSize="medium" />,
      path: '/admin/pedidos',
      color: 'secondary'
    },
    {
      title: 'Usuarios',
      description: 'Administrar cuentas de usuarios y administradores',
      icon: <People fontSize="medium" />,
      path: '/admin/usuarios',
      color: 'success'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes de ventas',
      icon: <BarChart fontSize="medium" />,
      path: '/admin/reportes',
      color: 'info'
    },
    {
      title: 'Configuración',
      description: 'Configurar ajustes del sistema',
      icon: <Settings fontSize="medium" />,
      path: '/admin/configuracion',
      color: 'warning'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ pt: 1, pb: 2 }}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h3" component="h1" fontWeight="800" gutterBottom sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 0.5
          }}>
            Panel de Administración
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Bienvenido, <strong>{user?.name || 'Administrador'}</strong>. Gestiona tu tienda desde aquí.
          </Typography>
          <Chip 
            icon={<Security />} 
            label="Sistema Administrativo" 
            color="primary" 
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        {/* Progress Bar Separator */}
        <LinearProgress 
          variant="determinate" 
          value={100} 
          sx={{ 
            height: 3, 
            borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.success.main} 100%)`,
            opacity: 0.6
          }} 
        />
      </Box>

      {/* Statistics Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight="700" sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          Resumen General
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Productos"
              value={stats.totalProductos}
              subtitle="En catálogo activo"
              icon={<Inventory />}
              color="primary"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pedidos Totales"
              value={stats.totalPedidos}
              subtitle="Procesados"
              icon={<ShoppingCart />}
              color="secondary"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Usuarios Registrados"
              value={stats.totalUsuarios}
              subtitle="Clientes activos"
              icon={<People />}
              color="success"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ventas Totales"
              value={stats.ventasTotales}
              subtitle="Ingresos generados"
              icon={<AttachMoney />}
              color="info"
              loading={loading}
              prefix="S/. "
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Main Menu Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight="700" sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
          Módulos de Gestión
        </Typography>
        
        <Grid container spacing={2.5}>
          {adminMenuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 12px 28px ${alpha(theme.palette[item.color].main, 0.15)}`,
                    border: `1px solid ${alpha(theme.palette[item.color].main, 0.3)}`
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette[item.color].main, 0.1),
                      color: `${item.color}.main`,
                      width: 56,
                      height: 56,
                      mb: 1.5
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="subtitle1" component="h3" gutterBottom fontWeight="600" sx={{ fontSize: '1rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4, fontSize: '0.85rem', flexGrow: 1 }}>
                    {item.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color={item.color}
                    endIcon={<Visibility />}
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      mt: 'auto',
                      width: '100%'
                    }}
                  >
                    Gestionar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;