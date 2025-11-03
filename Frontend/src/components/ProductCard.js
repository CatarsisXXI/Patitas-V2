import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, IconButton, Box } from '@mui/material';

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



  // A placeholder image in case the product doesn't have one
  const imageUrl = product.imagenURL
  ? `http://localhost:5288${product.imagenURL}`
  : 'https://via.placeholder.com/300x200.png?text=Patitas+y+Sabores';

  return (
    <Card sx={{
      maxWidth: 345,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6,
      },
      '&:hover .product-card-image': {
        transform: 'scale(1.1)',
      }
    }}>
       {user && (
          <IconButton
            aria-label="add to favorites"
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1, // Ensure icon is above the image
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              }
            }}
          >

            <PetsIcon color={isProdFavorite ? "error" : "inherit"} />
          </IconButton>
        )}
      <Box sx={{ height: 140, overflow: 'hidden' }}>
        <CardMedia
          className="product-card-image"
          component="img"
          height="140"
          image={imageUrl}
          alt={product.nombre}
          sx={{
            transition: 'transform 0.5s ease'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {product.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.descripcion.substring(0, 100)}{product.descripcion.length > 100 ? '...' : ''}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          S/{product.precio}
          {product.stock > 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 1 }}>
              (Stock: {product.stock})
            </Typography>
          ) : (
            <Typography variant="body2" color="error" sx={{ display: 'inline', ml: 1, fontWeight: 'bold' }}>
              Sin Stock
            </Typography>
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/productos/${product.productoID}`} size="small">Ver Detalles</Button>
        <Button
          size="small"
          onClick={() => addProductToCart(product.productoID, 1)}
          disabled={!user || product.stock === 0}
        >

          Agregar al Carrito
        </Button>
      </CardActions>

    </Card>

  );
};

export default ProductCard;