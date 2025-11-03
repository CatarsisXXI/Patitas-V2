import React, { useState, useEffect } from 'react';


import { useParams, Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PetsIcon from '@mui/icons-material/Pets';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';


import { useFavorites } from '../context/FavoritesContext';
import { formatCurrency } from '../utils/formatCurrency';



const ProductoDetallePage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const { addProductToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();




  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductoById(id);
        if (data) {
          setProduct(data);
        } else {
          setError('Producto no encontrado.');
        }
      } catch (err) {
        setError('Error al cargar el producto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} to="/productos" sx={{ mt: 2 }}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  if (!product) {
    return null; // Should be handled by error state
  }

  const isProdFavorite = isFavorite(product.productoID);

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
  component="img"
  image={
    product.imagenURL
      ? `${process.env.REACT_APP_API_URL || 'http://localhost:5288'}${product.imagenURL}`
      : 'https://via.placeholder.com/400x300.png?text=Patitas+y+Sabores'
  }
  alt={product.nombre}
  sx={{ maxHeight: 500, objectFit: 'contain', borderRadius: 2 }}
/>

          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.nombre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Categoría: {product.categoriaNombre}
          </Typography>
          <Typography variant="h5" sx={{ my: 2 }}>
            {formatCurrency(product.precio)}
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

          <Typography variant="body1" paragraph>
            {product.descripcion}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => addProductToCart(product.productoID, 1)}
              disabled={!user || product.stock === 0}
            >


              Añadir al carrito
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PetsIcon />}
              onClick={() => toggleFavorite(product.productoID)}
              disabled={!user}
            >
              {isProdFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductoDetallePage;