import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { color, font, radius, spring, z } from '../../theme/tokens';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const isActive = (pathname, link) => (link.end ? pathname === link.to : pathname.startsWith(link.to));

const Navbar = () => {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const { itemCount, pulse, openCart } = useCart();
  const { favoritesCount } = useFavorites();
  const { notify } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuAnchor(null);
  }, [pathname]);

  const links = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/productos', label: 'Catálogo' },
    isCustomer && { to: '/mascotas', label: 'Mis mascotas' },
    isAdmin && { to: '/admin', label: 'Panel' },
  ].filter(Boolean);

  const accountLinks = isCustomer
    ? [
        { to: '/mascotas', label: 'Mis mascotas', icon: <PetsRoundedIcon fontSize="small" /> },
        { to: '/favoritos', label: 'Favoritos', icon: <FavoriteBorderRoundedIcon fontSize="small" /> },
        { to: '/mis-compras', label: 'Mis compras', icon: <LocalMallOutlinedIcon fontSize="small" /> },
        { to: '/mis-boletas', label: 'Mis boletas', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
      ]
    : [{ to: '/admin', label: 'Panel de administración', icon: <SpaceDashboardOutlinedIcon fontSize="small" /> }];

  const handleLogout = () => {
    setMenuAnchor(null);
    setMobileOpen(false);
    logout();
    navigate('/');
    notify('Cerraste sesión. Hasta pronto.', { severity: 'info' });
  };

  return (
    <Box
      component="header"
      className="no-print"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: z.nav,
        height: 'var(--nav-h)',
        backgroundColor: scrolled ? 'rgba(246, 242, 231, 0.84)' : 'rgba(246, 242, 231, 0)',
        backdropFilter: scrolled ? 'saturate(140%) blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(140%) blur(14px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? color.line : 'transparent',
        transition: 'background-color 240ms ease, border-color 240ms ease',
      }}
    >
      <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Logo size={44} />

        <Box component="nav" aria-label="Principal" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mx: 'auto' }}>
          {links.map((link) => {
            const active = isActive(pathname, link);
            return (
              <Box
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.end}
                aria-current={active ? 'page' : undefined}
                sx={{
                  position: 'relative',
                  px: 2,
                  py: 1,
                  borderRadius: `${radius.pill}px`,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: active ? color.olive[700] : color.inkSoft,
                  transition: 'color 160ms ease',
                  '&:hover': { color: color.ink },
                }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    transition={spring.snappy}
                    style={{ position: 'absolute', inset: 0, borderRadius: radius.pill, background: color.olive[100], zIndex: 0 }}
                  />
                )}
                <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                  {link.label}
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, md: 0.75 }, ml: { xs: 'auto', md: 0 } }}>
          {isCustomer && (
            <>
              <Tooltip title="Favoritos">
                <IconButton component={Link} to="/favoritos" aria-label={`Favoritos, ${favoritesCount} guardados`} sx={{ display: { xs: 'none', sm: 'inline-flex' }, width: 44, height: 44 }}>
                  <Badge badgeContent={favoritesCount} color="secondary" overlap="circular">
                    <FavoriteBorderRoundedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Carrito">
                <IconButton onClick={openCart} aria-label={`Abrir carrito, ${itemCount} productos`} sx={{ width: 44, height: 44 }}>
                  <motion.span
                    key={pulse}
                    initial={pulse ? { scale: 1.35, rotate: -8 } : false}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <Badge badgeContent={itemCount} color="primary" overlap="circular">
                      <ShoppingBagOutlinedIcon />
                    </Badge>
                  </motion.span>
                </IconButton>
              </Tooltip>
            </>
          )}

          {user ? (
            <Button
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              aria-haspopup="menu"
              aria-expanded={menuAnchor ? 'true' : undefined}
              aria-controls={menuAnchor ? 'menu-cuenta' : undefined}
              endIcon={<KeyboardArrowDownRoundedIcon />}
              sx={{ display: { xs: 'none', md: 'inline-flex' }, pl: 0.75, pr: 1.5, gap: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32, mr: 0.75, bgcolor: color.cocoa, color: color.paper, fontSize: '0.8125rem', fontWeight: 700 }}>
                {initials(user.name) || 'PS'}
              </Avatar>
              {user.firstName || 'Mi cuenta'}
            </Button>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button component={Link} to="/login" variant="text">
                Iniciar sesión
              </Button>
              <Button component={Link} to="/registro" variant="contained">
                Crear cuenta
              </Button>
            </Box>
          )}

          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, width: 44, height: 44, color: color.ink }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Box>
      </Container>

      <Menu
        id="menu-cuenta"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 240 } } }}
      >
        <Box sx={{ px: 1.5, py: 1.25 }}>
          <Typography sx={{ fontWeight: 650, lineHeight: 1.3 }}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isAdmin ? 'Administrador' : 'Cliente'}
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        {accountLinks.map((item) => (
          <MenuItem key={item.to} component={Link} to={item.to} onClick={() => setMenuAnchor(null)}>
            <ListItemIcon sx={{ color: color.inkSoft }}>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ color: color.inkSoft }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: 'none' }, zIndex: z.drawer }}
        slotProps={{ paper: { sx: { width: 'min(88vw, 360px)', display: 'flex', flexDirection: 'column' } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, height: 'var(--nav-h)' }}>
          <Logo size={40} onClick={() => setMobileOpen(false)} />
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" sx={{ width: 44, height: 44 }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box component="nav" aria-label="Menú móvil" sx={{ px: 2.5, pt: 2, flex: 1, overflowY: 'auto' }}>
          {links.map((link, index) => {
            const active = isActive(pathname, link);
            return (
              <Box
                key={link.to}
                component={motion.div}
                initial={{ opacity: 0, x: 24 }}
                animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                transition={{ delay: 0.06 + index * 0.05, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                <Box
                  component={Link}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    display: 'block',
                    py: 1.25,
                    fontFamily: font.display,
                    fontSize: '1.75rem',
                    letterSpacing: '-0.02em',
                    fontVariationSettings: "'SOFT' 100",
                    color: active ? color.olive[600] : color.ink,
                    fontStyle: active ? 'italic' : 'normal',
                  }}
                >
                  {link.label}
                </Box>
              </Box>
            );
          })}

          {user && (
            <>
              <Divider sx={{ my: 2.5 }} />
              <Typography variant="overline" sx={{ color: color.inkMuted }}>
                {user.name}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {accountLinks.map((item) => (
                  <Box
                    key={item.to}
                    component={Link}
                    to={item.to}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, fontWeight: 600, color: color.inkSoft }}
                  >
                    {item.icon}
                    {item.label}
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ p: 2.5, display: 'grid', gap: 1.25, borderTop: `1px solid ${color.line}` }}>
          {user ? (
            <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutRoundedIcon />} fullWidth>
              Cerrar sesión
            </Button>
          ) : (
            <>
              <Button component={Link} to="/registro" variant="contained" size="large" fullWidth>
                Crear cuenta
              </Button>
              <Button component={Link} to="/login" variant="outlined" size="large" fullWidth>
                Iniciar sesión
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
