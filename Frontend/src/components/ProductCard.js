import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  IconButton,
  Box,
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

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(product.productoID);
  };

  const imageUrl = product.imagenURL
    ? `http://localhost:5288${product.imagenURL}`
    : 'https://via.placeholder.com/400x300.png?text=Patitas+y+Sabores';

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
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
            objectFit: 'cover',
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
          component={Link}
          to={`/productos/${product.productoID}`}
          size="small"
          sx={{ textTransform: 'none', minWidth: 0 }}
        >
          Ver Detalles
        </Button>
        <Button
          size="small"
          onClick={() => addProductToCart(product.productoID, 1)}
          disabled={!user || product.stock === 0}
          sx={{ textTransform: 'none', minWidth: 0 }}
        >
          Agregar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
