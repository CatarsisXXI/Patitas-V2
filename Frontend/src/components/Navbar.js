import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Grow, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { favoritesCount } = useFavorites();

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  // Function to format the display name
  const getDisplayName = (fullName, role) => {
    if (role === 'Admin') {
      // For admins, split the full name and show first name + first last name
      const nameParts = fullName.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0]} ${nameParts[1]}`;
      }
      return nameParts[0] || fullName;
    } else {
      // For clients, just show the first name (since we only have first name in token)
      return fullName;
    }
  };

  return (
    <AppBar
  position="fixed"
  sx={{
    background: '#7f814d',
    color: '#fff',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  }}
>
<Toolbar
  sx={{
    minHeight: 80,
    px: 2,                 // un poquito de padding interno (opcional)
    display: 'flex',
    alignItems: 'center',
  }}
>
  {/* IZQUIERDA: Nombre + eslogan */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <Grow in={true} timeout={1000}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography
          variant="h6" // más grande
          sx={{
            fontWeight: 'bold',
            lineHeight: 1,
            fontFamily: '"Anicon Slab", serif',
            color: '#3d210a',
          }}
        >
          Patitas y Sabores
        </Typography>
        <Typography
          variant="subtitle2" // más pequeño que h6
          sx={{
            fontWeight: 'bold',
            lineHeight: 1.1,
            fontFamily: '"Chewy", cursive',
            color: '#3d210a',
          }}
        >
          Amor Natural
        </Typography>
      </Box>
    </Grow>
  </Box>

  {/* CENTRO: Logo */}
  <Box
    sx={{
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Grow in={true} timeout={1100}>
      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        <img src="/assets/logo.png" alt="Logo" style={{ height: 80 }} />
      </Box>
    </Grow>
  </Box>

  {/* DERECHA: menú / usuario / iconos */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    }}
  >
    <Grow in={true} timeout={1200}>
      <Button color="inherit" component={Link} to="/productos" sx={{ fontWeight: 'bold' }}>
        Productos
      </Button>
    </Grow>

    {user ? (
      <>
        <Grow in={true} timeout={1400}>
          <Typography component="span" sx={{ p: 2 }}>
            Hola, {getDisplayName(user.name, user.role)}
          </Typography>
        </Grow>

        {user.role === 'Admin' && (
          <Grow in={true} timeout={1600}>
            <Button
              color="inherit"
              component={Link}
              to="/admin"
              sx={{ mr: 1, fontWeight: 'bold' }}
            >
              Admin
            </Button>
          </Grow>
        )}

        {user.role !== 'Admin' && (
          <>
            <Grow in={true} timeout={1900}>
              <Button
                color="inherit"
                component={Link}
                to="/mascotas"
                sx={{ mr: 1, fontWeight: 'bold' }}
              >
                Mascotas
              </Button>
            </Grow>
            <Grow in={true} timeout={2000}>
              <Tooltip title="Favoritos">
                <IconButton component={Link} to="/favoritos" color="inherit" aria-label="favoritos">
                  <Badge badgeContent={favoritesCount} color="error">
                    <PetsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Grow>
            <Grow in={true} timeout={2200}>
              <Tooltip title="Carrito">
                <IconButton component={Link} to="/carrito" color="inherit" aria-label="carrito">
                  <Badge badgeContent={itemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Grow>
          </>
        )}

        <Grow in={true} timeout={2400}>
          <Button color="inherit" onClick={logout} sx={{ fontWeight: 'bold' }}>
            Cerrar Sesión
          </Button>
        </Grow>
      </>
    ) : (
      <Grow in={true} timeout={1400}>
        <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 'bold' }}>
          Iniciar Sesión
        </Button>
      </Grow>
    )}
  </Box>
</Toolbar>
    </AppBar>
  );
};

export default Navbar;