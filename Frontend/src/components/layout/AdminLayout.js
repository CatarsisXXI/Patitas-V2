import React, { Suspense, useEffect, useState } from 'react';
import { Avatar, Box, Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import adminTheme from '../../theme/adminTheme';
import Logo from '../ui/Logo';
import PageLoader from '../ui/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { color, ease, layout, radius, spring } from '../../theme/tokens';

const NAV = [
  { to: '/admin', label: 'Resumen', icon: <SpaceDashboardOutlinedIcon fontSize="small" />, end: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
  { to: '/admin/productos', label: 'Productos', icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { to: '/admin/usuarios', label: 'Clientes', icon: <GroupOutlinedIcon fontSize="small" /> },
  { to: '/admin/reportes', label: 'Reportes', icon: <InsightsOutlinedIcon fontSize="small" /> },
  { to: '/admin/configuracion', label: 'Configuración', icon: <TuneOutlinedIcon fontSize="small" /> },
];

const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ px: 1, py: 1.5 }}>
        <Logo to="/admin" size={40} onClick={onNavigate} />
      </Box>

      <Box component="nav" aria-label="Panel de administración" sx={{ mt: 2.5, flex: 1, display: 'grid', alignContent: 'start', gap: 0.5 }}>
        {NAV.map((item) => {
          const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Box
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                minHeight: 44,
                borderRadius: `${radius.sm}px`,
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: active ? color.olive[700] : color.inkSoft,
                transition: 'color 160ms ease, background-color 160ms ease',
                '&:hover': { color: color.ink, bgcolor: active ? 'transparent' : 'rgba(61, 38, 20, 0.05)' },
              }}
            >
              {active && (
                <motion.span layoutId="admin-nav-active" transition={spring.snappy} style={{ position: 'absolute', inset: 0, borderRadius: radius.sm, background: color.olive[100] }} />
              )}
              <Box component="span" sx={{ position: 'relative', display: 'inline-flex' }}>
                {item.icon}
              </Box>
              <Box component="span" sx={{ position: 'relative' }}>
                {item.label}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        component={Link}
        to="/"
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, minHeight: 44, borderRadius: `${radius.sm}px`, fontWeight: 600, fontSize: '0.9375rem', color: color.inkSoft, '&:hover': { color: color.ink, bgcolor: 'rgba(61, 38, 20, 0.05)' } }}
      >
        <StorefrontOutlinedIcon fontSize="small" />
        Ver la tienda
      </Box>

      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${color.line}`, display: 'flex', alignItems: 'center', gap: 1.25, px: 0.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: color.cocoa, color: color.paper, fontSize: '0.8125rem', fontWeight: 700 }}>
          {(user?.name || 'A')
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 650, fontSize: '0.875rem', lineHeight: 1.3 }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Administrador
          </Typography>
        </Box>
        <Tooltip title="Cerrar sesión">
          <IconButton onClick={handleLogout} aria-label="Cerrar sesión" sx={{ width: 40, height: 40 }}>
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

/** Estructura del panel: barra lateral fija en escritorio, cajón en móvil. */
const AdminLayout = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <ThemeProvider theme={adminTheme}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: layout.adminSidebar,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            height: '100dvh',
            borderRight: `1px solid ${color.line}`,
            bgcolor: 'rgba(255, 253, 248, 0.6)',
          }}
        >
          <Sidebar />
        </Box>

        <Drawer open={open} onClose={() => setOpen(false)} sx={{ display: { lg: 'none' } }} slotProps={{ paper: { sx: { width: 'min(84vw, 300px)' } } }}>
          <Sidebar onNavigate={() => setOpen(false)} />
        </Drawer>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              alignItems: 'center',
              gap: 1,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              height: 60,
              px: 1.5,
              bgcolor: 'rgba(246, 242, 231, 0.88)',
              backdropFilter: 'blur(12px)',
              borderBottom: `1px solid ${color.line}`,
            }}
          >
            <IconButton onClick={() => setOpen(true)} aria-label="Abrir menú del panel" sx={{ width: 44, height: 44, color: color.ink }}>
              <MenuRoundedIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 650 }}>{NAV.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))?.label || 'Panel'}</Typography>
          </Box>

          <Box
            component={motion.main}
            id="contenido"
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: ease.out }}
            sx={{ px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, lg: 5 }, maxWidth: 1240, mx: 'auto' }}
          >
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
