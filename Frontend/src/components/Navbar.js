import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Grow } from '@mui/material';
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
    <AppBar position="fixed" sx={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', color: '#333', boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Toolbar>
        <Grow in={true} timeout={1000}>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
            Patitas y Sabores
          </Typography>
        </Grow>
        <Box>
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

              {/* Admin Button - Only show for admin users */}
              {user.role === 'Admin' && (
                <Grow in={true} timeout={1600}>
                  <Button color="inherit" component={Link} to="/admin" sx={{ mr: 1, fontWeight: 'bold' }}>
                    Admin
                  </Button>
                </Grow>
              )}

              {/* User-specific buttons - Only show for non-admin users */}
              {user.role !== 'Admin' && (
                <>
                  {/* Mis Compras hidden as per requirement */}

                  <Grow in={true} timeout={1900}>
                    <Button color="inherit" component={Link} to="/mascotas" sx={{ mr: 1, fontWeight: 'bold' }}>
                      Mascotas
                    </Button>
                  </Grow>
                  <Grow in={true} timeout={2000}>
                    <IconButton component={Link} to="/favoritos" color="inherit" aria-label="favoritos">
                      <Badge badgeContent={favoritesCount} color="error">
                        <PetsIcon />
                      </Badge>
                    </IconButton>
                  </Grow>
                  <Grow in={true} timeout={2200}>
                    <IconButton component={Link} to="/carrito" color="inherit" aria-label="carrito">
                      <Badge badgeContent={itemCount} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
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