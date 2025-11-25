import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Button,
  Fade,
  Zoom,
  Grow,
  Paper,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import favoritoService from '../services/favoritoService';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import LoginIcon from '@mui/icons-material/Login';

const FavoritosPage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await favoritoService.getFavoritos();
        setFavoriteProducts(data);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#5D4E37',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} 
        />
        <Typography variant="h6" sx={{ color: '#5D4E37' }}>
          Cargando tus favoritos...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ maxWidth: 500, mx: 'auto', py: 8 }}>
            <LoginIcon 
              sx={{ 
                fontSize: 80, 
                color: 'rgba(93, 78, 55, 0.3)',
                mb: 2
              }} 
            />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#5D4E37',
                mb: 2
              }}
            >
              Inicia sesión para ver tus favoritos
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#7D6B5D', 
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Guarda tus productos favoritos para acceder a ellos rápidamente y no perderte de las novedades que te encantan.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="contained"
              sx={{
                backgroundColor: '#5D4E37',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#3D2E1F',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(93, 78, 55, 0.3)',
                }
              }}
              startIcon={<PersonIcon />}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Fade>
      </Container>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ maxWidth: 500, mx: 'auto', py: 8 }}>
            <HeartBrokenIcon 
              sx={{ 
                fontSize: 80, 
                color: 'rgba(93, 78, 55, 0.3)',
                mb: 2
              }} 
            />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#5D4E37',
                mb: 2
              }}
            >
              Tu lista de favoritos está vacía
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#7D6B5D', 
                mb: 4,
                lineHeight: 1.6
              }}
            >
              ¡Descubre productos increíbles para tu mascota y guárdalos aquí para encontrarlos fácilmente después!
            </Typography>
            <Button 
              component={RouterLink} 
              to="/productos" 
              variant="contained"
              sx={{
                backgroundColor: '#5D4E37',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#3D2E1F',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(93, 78, 55, 0.3)',
                }
              }}
              startIcon={<ShoppingBagIcon />}
            >
              Explorar Productos
            </Button>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #F8F6F0 0%, #FAF9F6 50%, #FFFFFF 100%)' }}>
      <Container sx={{ py: 3 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            style={{ display: 'flex', alignItems: 'center', color: '#7D6B5D', textDecoration: 'none' }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Inicio
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/productos"
            style={{ display: 'flex', alignItems: 'center', color: '#7D6B5D', textDecoration: 'none' }}
          >
            <ShoppingBagIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Productos
          </Link>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', color: '#5D4E37', fontWeight: 600 }}
          >
            <FavoriteIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Mis Favoritos
          </Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                color: '#5D4E37',
                mb: 1,
                fontSize: { xs: '2.5rem', md: '3rem' }
              }}
            >
              Mis Favoritos
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#7D6B5D',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Tus productos preferidos, siempre a un clic de distancia
            </Typography>
          </Box>
        </Fade>

        {/* Favorites Summary */}
        <Fade in={true} timeout={1000}>
          <Paper 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
              boxShadow: '0 8px 32px rgba(93, 78, 55, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                    mr: 2
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 30, color: '#F44336' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                    {favoriteProducts.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7D6B5D' }}>
                    Productos en favoritos
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<FavoriteIcon />}
                  label="Tus productos favoritos"
                  variant="outlined"
                  sx={{
                    borderColor: '#F44336',
                    color: '#5D4E37',
                    fontWeight: 600,
                    backgroundColor: 'rgba(244, 67, 54, 0.05)'
                  }}
                />
                <Chip
                  icon={<ShoppingBagIcon />}
                  label={`${favoriteProducts.length} productos guardados`}
                  variant="outlined"
                  sx={{
                    borderColor: '#5D4E37',
                    color: '#5D4E37',
                    fontWeight: 600,
                    backgroundColor: 'rgba(93, 78, 55, 0.05)'
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Favorites Grid */}
        <Grid container spacing={3}>
          {favoriteProducts.map((product, index) => (
            <Grow in={true} timeout={500 + index * 100} key={product.productoID}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  buttonColor="#5D4E37"
                />
              </Grid>
            </Grow>
          ))}
        </Grid>

        {/* Continue Shopping */}
        <Fade in={true} timeout={1600}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/productos"
              variant="outlined"
              startIcon={<ShoppingBagIcon />}
              sx={{
                borderColor: '#5D4E37',
                color: '#5D4E37',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: '12px',
                '&:hover': {
                  borderColor: '#5D4E37',
                  backgroundColor: 'rgba(93, 78, 55, 0.04)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Seguir Explorando
            </Button>
          </Box>
        </Fade>

        {/* Empty State Illustration (Hidden but ready for future use) */}
        <Box sx={{ display: 'none' }}>
          {/* This can be used for future empty state illustrations */}
          <Card 
            sx={{ 
              textAlign: 'center', 
              p: 6, 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
              boxShadow: '0 8px 32px rgba(93, 78, 55, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              maxWidth: 400,
              mx: 'auto',
              my: 4
            }}
          >
            <CardContent>
              <FavoriteBorderIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'rgba(93, 78, 55, 0.3)',
                  mb: 2
                }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#5D4E37', mb: 2 }}>
                Comienza a guardar favoritos
              </Typography>
              <Typography variant="body1" sx={{ color: '#7D6B5D', mb: 3 }}>
                Haz clic en el corazón de los productos que más te gusten para verlos aquí.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default FavoritosPage;