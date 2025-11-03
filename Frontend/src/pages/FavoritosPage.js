import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, CircularProgress, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import favoritoService from '../services/favoritoService';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Inicia sesión para ver tus favoritos</Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Tu lista de favoritos está vacía</Typography>
        <Typography variant="subtitle1" gutterBottom>
          ¡Agrega productos que te gusten para verlos aquí!
        </Typography>
        <Button component={Link} to="/productos" variant="contained" sx={{ mt: 2 }}>
          Explorar Productos
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Favoritos
      </Typography>
      <Grid container spacing={4}>
        {favoriteProducts.map((product) => (
          <Grid item key={product.productoID} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FavoritosPage;