import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  Chip,
  Rating,
  Fade,
  Zoom,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import PetsIcon from '@mui/icons-material/Pets';
import NutritionIcon from '@mui/icons-material/Restaurant';
import HealthIcon from '@mui/icons-material/Healing';
import WarningIcon from '@mui/icons-material/Warning';

// Función auxiliar para extraer cada sección
const extractSection = (text, startLabel, endLabel) => {
  const startIndex = text.indexOf(startLabel);
  if (startIndex === -1) return '';

  const fromStart = text.slice(startIndex + startLabel.length);

  if (!endLabel) {
    return fromStart.trim();
  }

  const endIndex = fromStart.indexOf(endLabel);
  if (endIndex === -1) {
    return fromStart.trim();
  }

  return fromStart.slice(0, endIndex).trim();
};

const ProductCard = ({ product, buttonColor = "#5D4E37" }) => {
  const { addProductToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isProdFavorite = isFavorite(product.productoID);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(product.productoID);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addProductToCart(product.productoID, 1);
  };

  const imageUrl = product.imagenURL
    ? `http://localhost:5288${product.imagenURL}`
    : 'https://via.placeholder.com/400x300.png?text=Patitas+y+Sabores';

  // --- Aquí procesamos la descripción original ---
  const rawDesc = product.descripcion || '';

  const perfilText = extractSection(
    rawDesc,
    'Perfil del producto:',
    'Composición funcional:'
  );
  const composicionText = extractSection(
    rawDesc,
    'Composición funcional:',
    'Beneficios principales:'
  );
  const beneficiosText = extractSection(
    rawDesc,
    'Beneficios principales:',
    'Recomendado para:'
  );
  const recomendadoText = extractSection(
    rawDesc,
    'Recomendado para:',
    'Evitar en:'
  );
  const evitarText = extractSection(
    rawDesc,
    'Evitar en:',
    null
  );

  const hasDetails = perfilText || composicionText || beneficiosText || recomendadoText || evitarText;

  return (
    <>
      <Fade in={true} timeout={800}>
        <Card
          sx={{
            maxWidth: 345,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'visible',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
            boxShadow: '0 4px 20px rgba(93, 78, 55, 0.08)',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 40px rgba(93, 78, 55, 0.15)',
              borderColor: 'rgba(212, 165, 116, 0.4)',
            },
          }}
        >
          {/* Favorite Button */}
          {user && (
            <Tooltip title={isProdFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
              <IconButton
                aria-label="add to favorites"
                onClick={handleFavoriteClick}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {isProdFavorite ? (
                  <FavoriteIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: '#5D4E37', fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          )}

          {/* Stock Status Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
            }}
          >
            {product.stock === 0 ? (
              <Chip
                label="Agotado"
                size="small"
                sx={{
                  backgroundColor: 'rgba(244, 67, 54, 0.9)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(10px)',
                }}
              />
            ) : product.stock < 10 ? (
              <Chip
                label="Últimas unidades"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 152, 0, 0.9)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(10px)',
                }}
              />
            ) : null}
          </Box>

          {/* Image Container */}
          <Box
            sx={{
              height: 220,
              backgroundColor: '#f8f7f4',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '16px 16px 0 0',
            }}
          >
            {!imageLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(248, 247, 244, 0.8)',
                }}
              >
                <PetsIcon sx={{ fontSize: 48, color: 'rgba(93, 78, 55, 0.3)' }} />
              </Box>
            )}
            <CardMedia
              component="img"
              image={imageUrl}
              alt={product.nombre}
              onLoad={() => setImageLoaded(true)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                transition: 'transform 0.6s ease',
                transform: imageLoaded ? 'scale(1)' : 'scale(0.9)',
                opacity: imageLoaded ? 1 : 0,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Box>

          {/* Card Content */}
          <CardContent
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              py: 2,
              px: 2.5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: '#5D4E37',
                  lineHeight: 1.3,
                  mb: 1,
                  minHeight: '2.6em',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.nombre}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <LocalOfferIcon sx={{ fontSize: 18, color: '#D4A574', mr: 0.5 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#5D4E37',
                    background: 'linear-gradient(135deg, #5D4E37 0%, #8A7B5D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  S/{product.precio}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <InventoryIcon sx={{ fontSize: 16, color: product.stock > 0 ? '#4CAF50' : '#F44336' }} />
              <Typography
                variant="body2"
                sx={{
                  color: product.stock > 0 ? '#4CAF50' : '#F44336',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </Typography>
            </Box>
          </CardContent>

          {/* Card Actions */}
          <CardActions sx={{ justifyContent: 'center', pb: 2.5, pt: 0, gap: 1 }}>
            <Tooltip title="Ver detalles del producto">
              <Button
                size="small"
                onClick={handleOpenModal}
                startIcon={<VisibilityIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: buttonColor,
                  border: `1.5px solid ${buttonColor}`,
                  fontWeight: 600,
                  px: 2,
                  py: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: buttonColor,
                    color: '#FFFFFF',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${buttonColor}40`,
                  },
                }}
              >
                Detalles
              </Button>
            </Tooltip>

            <Tooltip title={!user ? "Inicia sesión para agregar" : product.stock === 0 ? "Producto agotado" : "Agregar al carrito"}>
              <span>
                <Button
                  size="small"
                  onClick={handleAddToCart}
                  disabled={!user || product.stock === 0}
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '10px',
                    backgroundColor: buttonColor,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    px: 2,
                    py: 0.8,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#3D2E1F',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${buttonColor}40`,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(93, 78, 55, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  Agregar
                </Button>
              </span>
            </Tooltip>
          </CardActions>
        </Card>
      </Fade>

      {/* Product Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.2)' },
        }}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
            boxShadow: '0 20px 60px rgba(93, 78, 55, 0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 800, 
          color: '#5D4E37',
          pb: 1,
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(168, 181, 160, 0.1) 100%)',
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
            {product.nombre}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#5D4E37',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: '#FFFFFF',
                transform: 'scale(1.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Image Section */}
            <Box sx={{ 
              flex: { lg: 1 }, 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #FAF9F6 0%, #F8F6F0 100%)',
            }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 350,
                  backgroundColor: '#f8f7f4',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(93, 78, 55, 0.1)',
                  mb: 3,
                }}
              >
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={product.nombre}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                />
              </Box>

              {/* Quick Info */}
              <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                  <LocalOfferIcon sx={{ fontSize: 24, color: '#D4A574', mr: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#5D4E37' }}>
                    S/{product.precio}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <Chip
                    icon={<InventoryIcon />}
                    label={product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                    color={product.stock > 0 ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  {product.stock > 0 && product.stock < 10 && (
                    <Chip
                      label="¡Últimas unidades!"
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Details Section */}
            <Box sx={{ 
              flex: { lg: 1.2 }, 
              p: 4,
              maxHeight: '70vh',
              overflow: 'auto',
            }}>
              {hasDetails ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {perfilText && (
                    <Zoom in timeout={600}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: '12px',
                        background: 'rgba(212, 165, 116, 0.05)',
                        border: '1px solid rgba(212, 165, 116, 0.1)',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PetsIcon sx={{ color: '#D4A574', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                            Perfil del Producto
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#7D6B5D' }}>
                          {perfilText}
                        </Typography>
                      </Box>
                    </Zoom>
                  )}

                  {composicionText && (
                    <Zoom in timeout={800}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: '12px',
                        background: 'rgba(168, 181, 160, 0.05)',
                        border: '1px solid rgba(168, 181, 160, 0.1)',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <NutritionIcon sx={{ color: '#A8B5A0', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                            Composición Funcional
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#7D6B5D' }}>
                          {composicionText}
                        </Typography>
                      </Box>
                    </Zoom>
                  )}

                  {beneficiosText && (
                    <Zoom in timeout={1000}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: '12px',
                        background: 'rgba(93, 78, 55, 0.05)',
                        border: '1px solid rgba(93, 78, 55, 0.1)',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <HealthIcon sx={{ color: '#5D4E37', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                            Beneficios Principales
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#7D6B5D' }}>
                          {beneficiosText}
                        </Typography>
                      </Box>
                    </Zoom>
                  )}

                  {recomendadoText && (
                    <Zoom in timeout={1200}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PetsIcon sx={{ color: '#4CAF50', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                            Recomendado Para
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#7D6B5D', pl: 4 }}>
                          {recomendadoText}
                        </Typography>
                      </Box>
                    </Zoom>
                  )}

                  {evitarText && (
                    <Zoom in timeout={1400}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <WarningIcon sx={{ color: '#F44336', mr: 1.5, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                            Precauciones
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#7D6B5D', pl: 4 }}>
                          {evitarText}
                        </Typography>
                      </Box>
                    </Zoom>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PetsIcon sx={{ fontSize: 64, color: 'rgba(93, 78, 55, 0.3)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#5D4E37', mb: 1 }}>
                    Información del Producto
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7D6B5D' }}>
                    Próximamente disponible
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          justifyContent: 'center', 
          pb: 4, 
          pt: 3,
          background: 'linear-gradient(135deg, rgba(248, 246, 240, 0.8) 0%, rgba(250, 249, 246, 0.8) 100%)',
        }}>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined"
            sx={{
              borderRadius: '12px',
              borderColor: buttonColor,
              color: buttonColor,
              fontWeight: 600,
              px: 4,
              py: 1,
              '&:hover': {
                borderColor: buttonColor,
                backgroundColor: 'rgba(93, 78, 55, 0.04)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Cerrar
          </Button>
          <Button
            onClick={() => {
              addProductToCart(product.productoID, 1);
              handleCloseModal();
            }}
            variant="contained"
            disabled={!user || product.stock === 0}
            startIcon={<ShoppingCartIcon />}
            sx={{
              borderRadius: '12px',
              backgroundColor: buttonColor,
              color: '#FFFFFF',
              fontWeight: 600,
              px: 4,
              py: 1,
              '&:hover': {
                backgroundColor: '#3D2E1F',
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${buttonColor}40`,
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(93, 78, 55, 0.3)',
              },
            }}
          >
            Agregar al Carrito
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;