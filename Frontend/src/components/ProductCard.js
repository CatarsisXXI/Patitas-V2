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
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import PetsIcon from '@mui/icons-material/Pets';

const ProductCard = ({ product }) => {
  const { addProductToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isProdFavorite = isFavorite(product.productoID);
  const [modalOpen, setModalOpen] = useState(false);

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

  const imageUrl = product.imagenURL
    ? `http://localhost:5288${product.imagenURL}`
    : 'https://via.placeholder.com/400x300.png?text=Patitas+y+Sabores';

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: 3,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },
        '&:hover .product-card-image': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Icono de favoritos */}
      {user && (
        <IconButton
          aria-label="add to favorites"
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          <PetsIcon color={isProdFavorite ? 'error' : 'inherit'} />
        </IconButton>
      )}

      {/* Imagen del producto */}
      <Box
        sx={{
          height: 220,
          backgroundColor: '#f8f7f4',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <CardMedia
          className="product-card-image"
          component="img"
          image={imageUrl}
          alt={product.nombre}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>

      {/* Contenido más compacto */}
      <CardContent
        sx={{
          flexGrow: 1,
          textAlign: 'center',
          py: 1, // reduce padding vertical
          px: 2, // un poco menos de padding lateral
        }}
      >
        <Typography
          gutterBottom
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          {product.nombre}
        </Typography>

        <Typography variant="body1" color="primary" sx={{ fontWeight: 500 }}>
          S/{product.precio}
        </Typography>

        {product.stock > 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.2 }}
          >
            (Stock: {product.stock})
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="error"
            sx={{ display: 'block', mt: 0.2, fontWeight: 'bold' }}
          >
            Sin Stock
          </Typography>
        )}
      </CardContent>

      {/* Botones más compactos */}
      <CardActions sx={{ justifyContent: 'center', pb: 1, pt: 0 }}>
        <Button
          size="small"
          onClick={handleOpenModal}
          sx={{ textTransform: 'none', minWidth: 0, backgroundColor: '#d4a574', color: 'white', '&:hover': { backgroundColor: '#b8955e' } }}
        >
          Ver Detalles
        </Button>
        <Button
          size="small"
          onClick={() => addProductToCart(product.productoID, 1)}
          disabled={!user || product.stock === 0}
          sx={{ textTransform: 'none', minWidth: 0, backgroundColor: '#d4a574', color: 'white', '&:hover': { backgroundColor: '#b8955e' } }}
        >
          Agregar
        </Button>
      </CardActions>

      {/* Modal de detalles del producto */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: { backdropFilter: 'blur(5px)' },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {product.nombre}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Lado izquierdo: Imagen + información básica */}
            <Box sx={{ flex: 1, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CardMedia
                component="img"
                image={imageUrl}
                alt={product.nombre}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'contain',
                  borderRadius: 2,
                  backgroundColor: '#f8f7f4',
                }}
              />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {product.nombre}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  S/{product.precio}
                </Typography>
                <Typography variant="body2" color={product.stock > 0 ? 'text.secondary' : 'error'}>
                  {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock disponible'}
                </Typography>
              </Box>
            </Box>

            {/* Lado derecho: Información detallada */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Perfil del producto:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'justify' }}>
                  {product.descripcion}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Composición funcional:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'justify' }}>
                  Elaborado con ingredientes naturales de alta calidad, seleccionados específicamente para el bienestar de tu mascota.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Beneficios principales:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'justify' }}>
                  Promueve la salud digestiva, fortalece el sistema inmunológico y proporciona nutrición balanceada para un pelaje brillante y energía vital.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Recomendado para:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'justify' }}>
                  Perros y gatos de todas las edades, especialmente aquellos con necesidades nutricionales específicas o que requieren suplementación natural.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  Evitar en:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'justify' }}>
                  Animales con alergias conocidas a alguno de los ingredientes. Consultar con veterinario en caso de embarazo, lactancia o condiciones médicas especiales.
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={() => {
              addProductToCart(product.productoID, 1);
              handleCloseModal();
            }}
            variant="contained"
            disabled={!user || product.stock === 0}
          >
            Agregar al Carrito
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProductCard;
