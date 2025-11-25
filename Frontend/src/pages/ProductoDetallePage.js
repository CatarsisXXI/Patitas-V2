import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Grow,
  Breadcrumbs,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Snackbar
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import NutritionIcon from '@mui/icons-material/Restaurant';
import HealthIcon from '@mui/icons-material/Healing';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Link as RouterLink } from 'react-router-dom';


const ProductoDetallePage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const { addProductToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductoById(id);
        if (data) setProduct(data);
        else setError('Producto no encontrado.');
      } catch (err) {
        console.error(err);
        setError('Error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      setSnackbarMessage('Inicia sesión para agregar productos al carrito');
      setSnackbarOpen(true);
      return;
    }
    if (product.stock === 0) {
      setSnackbarMessage('Producto agotado');
      setSnackbarOpen(true);
      return;
    }
    addProductToCart(product.productoID, 1);
    setSnackbarMessage('¡Producto agregado al carrito!');
    setSnackbarOpen(true);
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      setSnackbarMessage('Inicia sesión para guardar favoritos');
      setSnackbarOpen(true);
      return;
    }
    toggleFavorite(product.productoID);
    setSnackbarMessage(isProdFavorite ? 'Eliminado de favoritos' : '¡Agregado a favoritos!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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
          Cargando producto...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', maxWidth: 500, mx: 'auto', py: 8 }}>
            <PetsIcon sx={{ fontSize: 80, color: 'rgba(93, 78, 55, 0.3)', mb: 2 }} />
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                '& .MuiAlert-message': {
                  textAlign: 'center',
                  width: '100%'
                }
              }}
            >
              {error}
            </Alert>
            <Button 
              component={RouterLink} 
              to="/productos" 
              variant="contained"
              sx={{
                backgroundColor: '#5D4E37',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#3D2E1F',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Volver al catálogo
            </Button>
          </Box>
        </Fade>
      </Container>
    );
  }

  if (!product) return null;

  const isProdFavorite = isFavorite(product.productoID);

  // 🧠 Función para separar las secciones
  const parseDescripcion = (text) => {
    const sections = [
      'Perfil del producto',
      'Composición funcional',
      'Beneficios principales',
      'Recomendado para',
      'Evitar en',
    ];

    const parsed = {};
    let current = null;
    text.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const found = sections.find((s) =>
        trimmed.toLowerCase().startsWith(s.toLowerCase())
      );
      if (found) {
        current = found;
        parsed[current] = '';
      } else if (current) {
        parsed[current] += trimmed + '\n';
      }
    });
    return parsed;
  };

  const parsed = parseDescripcion(product.descripcion);

  const renderSection = (title, content, icon, color = '#5D4E37') => (
    content && (
      <Grow in={true} timeout={800}>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
            boxShadow: '0 4px 20px rgba(93, 78, 55, 0.06)',
            border: '1px solid rgba(212, 165, 116, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(93, 78, 55, 0.1)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: `${color}15`,
                color: color,
                mr: 2,
                flexShrink: 0
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: color,
                fontWeight: 700,
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              color: '#7D6B5D',
              pl: 6
            }}
          >
            {content.trim()}
          </Typography>
        </Paper>
      </Grow>
    )
  );

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #F8F6F0 0%, #FAF9F6 50%, #FFFFFF 100%)',
      py: 3
    }}>
      <Container>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
  <Link
    component={RouterLink}
    to="/"
    underline="hover"
    sx={{ display: 'flex', alignItems: 'center', color: '#7D6B5D', textDecoration: 'none' }}
  >
    <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
    Inicio
  </Link>
  <Link
    component={RouterLink}
    to="/productos"
    underline="hover"
    sx={{ display: 'flex', alignItems: 'center', color: '#7D6B5D', textDecoration: 'none' }}
  >
    <StoreIcon sx={{ mr: 0.5, fontSize: 20 }} />
    Productos
  </Link>
  <Typography
    sx={{ display: 'flex', alignItems: 'center', color: '#5D4E37', fontWeight: 600 }}
  >
    <PetsIcon sx={{ mr: 0.5, fontSize: 20 }} />
    {product.nombre}
  </Typography>
</Breadcrumbs>

        {/* Back Button */}
        <Fade in={true} timeout={600}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              color: '#5D4E37',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(93, 78, 55, 0.04)',
              }
            }}
          >
            Volver
          </Button>
        </Fade>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {/* IZQUIERDA - Imagen e información básica */}
          <Box sx={{ flex: 1, maxWidth: 600 }}>
            <Fade in={true} timeout={800}>
              <Card 
                sx={{ 
                  borderRadius: '20px', 
                  boxShadow: '0 8px 40px rgba(93, 78, 55, 0.12)',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                  overflow: 'hidden',
                  mb: 4
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={
                      product.imagenURL
                        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5288'}${product.imagenURL}`
                        : 'https://via.placeholder.com/400x300.png?text=Patitas+y+Sabores'
                    }
                    alt={product.nombre}
                    onLoad={() => setImageLoaded(true)}
                    sx={{
                      width: '100%',
                      height: 400,
                      objectFit: 'contain',
                      backgroundColor: '#f8f7f4',
                      transition: 'transform 0.6s ease',
                      transform: imageLoaded ? 'scale(1)' : 'scale(0.95)',
                      opacity: imageLoaded ? 1 : 0.7,
                      '&:hover': {
                        transform: 'scale(1.02)',
                      }
                    }}
                  />
                  
                  {/* Favorite Button */}
                  {user && (
                    <Tooltip title={isProdFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
                      <IconButton
                        onClick={handleFavoriteToggle}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          width: 48,
                          height: 48,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#FFFFFF',
                            transform: 'scale(1.1)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                          },
                        }}
                      >
                        {isProdFavorite ? (
                          <FavoriteIcon sx={{ color: '#ff6b6b', fontSize: 24 }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ color: '#5D4E37', fontSize: 24 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Información básica */}
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      color: '#5D4E37',
                      mb: 2,
                      lineHeight: 1.2
                    }}
                  >
                    {product.nombre}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Chip
                      icon={<CategoryIcon />}
                      label={product.categoriaNombre}
                      variant="outlined"
                      sx={{
                        borderColor: '#A8B5A0',
                        color: '#5D4E37',
                        fontWeight: 600,
                        backgroundColor: 'rgba(168, 181, 160, 0.1)'
                      }}
                    />
                    
                    <Chip
                      icon={<InventoryIcon />}
                      label={product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                      color={product.stock > 0 ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalOfferIcon sx={{ fontSize: 32, color: '#D4A574', mr: 2 }} />
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800,
                        color: '#5D4E37',
                        background: 'linear-gradient(135deg, #5D4E37 0%, #8A7B5D 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {formatCurrency(product.precio)}
                    </Typography>
                  </Box>

                  {/* Botones de acción */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={handleAddToCart}
                      disabled={!user || product.stock === 0}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        backgroundColor: '#5D4E37',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(93, 78, 55, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#3D2E1F',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(93, 78, 55, 0.4)',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(93, 78, 55, 0.3)',
                        }
                      }}
                    >
                      {!user ? 'Inicia sesión' : product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </Button>

                    <Tooltip title={!user ? "Inicia sesión para guardar favoritos" : ""}>
                      <span>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={isProdFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          onClick={handleFavoriteToggle}
                          disabled={!user}
                          sx={{
                            borderColor: '#D4A574',
                            color: '#5D4E37',
                            fontWeight: 600,
                            py: 1.5,
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#5D4E37',
                              backgroundColor: 'rgba(93, 78, 55, 0.04)',
                              transform: 'translateY(-2px)',
                            },
                            '&.Mui-disabled': {
                              borderColor: 'rgba(212, 165, 116, 0.3)',
                              color: 'rgba(93, 78, 55, 0.3)',
                            }
                          }}
                        >
                          Favorito
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            </Fade>

            {/* Perfil del producto en la izquierda */}
            {renderSection(
              'Perfil del Producto', 
              parsed['Perfil del producto'], 
              <PetsIcon sx={{ fontSize: 20 }} />,
              '#D4A574'
            )}
          </Box>

          {/* DERECHA - Detalles del producto */}
          <Box sx={{ flex: 1, maxWidth: 600 }}>
            <Fade in={true} timeout={1000}>
              <Box>
                {renderSection(
                  'Composición Funcional', 
                  parsed['Composición funcional'], 
                  <NutritionIcon sx={{ fontSize: 20 }} />,
                  '#A8B5A0'
                )}
                
                {renderSection(
                  'Beneficios Principales', 
                  parsed['Beneficios principales'], 
                  <HealthIcon sx={{ fontSize: 20 }} />,
                  '#4CAF50'
                )}
                
                {renderSection(
                  'Recomendado Para', 
                  parsed['Recomendado para'], 
                  <CheckCircleIcon sx={{ fontSize: 20 }} />,
                  '#2196F3'
                )}
                
                {renderSection(
                  'Precauciones', 
                  parsed['Evitar en'], 
                  <WarningIcon sx={{ fontSize: 20 }} />,
                  '#FF9800'
                )}
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          sx={{ 
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

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

export default ProductoDetallePage;