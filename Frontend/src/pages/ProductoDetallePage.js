import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
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

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} to="/productos" sx={{ mt: 2 }}>
          Volver al catálogo
        </Button>
      </Container>
    );

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

  const renderSection = (title, content) => (
    content && (
      <Box key={title} sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 1,
            mt: 2,
          }}
        >
          {title}:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            textAlign: 'justify',
            lineHeight: 1.6,
          }}
        >
          {content.trim()}
        </Typography>
      </Box>
    )
  );

  const parsed = parseDescripcion(product.descripcion);

  return (
    <Container sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {/* IZQUIERDA */}
        <Box sx={{ flex: 1, maxWidth: 500 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 4, width: '100%' }}>
            <CardMedia
              component="img"
              image={
                product.imagenURL
                  ? `${process.env.REACT_APP_API_URL || 'http://localhost:5288'}${product.imagenURL}`
                  : 'https://via.placeholder.com/400x300.png?text=Patitas+y+Sabores'
              }
              alt={product.nombre}
              sx={{
                objectFit: 'contain',
                borderRadius: 2,
                maxHeight: 450,
              }}
            />
          </Card>

          {/* Nombre, categoría, precio y perfil */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.nombre}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Categoría: {product.categoriaNombre}
            </Typography>

            <Typography variant="h5" sx={{ my: 1 }}>
              {formatCurrency(product.precio)}{' '}
              {product.stock > 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'inline', ml: 1 }}
                >
                  (Stock: {product.stock})
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ display: 'inline', ml: 1, fontWeight: 'bold' }}
                >
                  Sin Stock
                </Typography>
              )}
            </Typography>

            {/* Solo "Perfil del producto" en la izquierda */}
            {renderSection('Perfil del producto', parsed['Perfil del producto'])}
          </Box>
        </Box>

        {/* DERECHA */}
        <Box sx={{ flex: 1, maxWidth: 600 }}>
          {/* Ahora Composición funcional está aquí */}
          {renderSection('Composición funcional', parsed['Composición funcional'])}
          {renderSection('Beneficios principales', parsed['Beneficios principales'])}
          {renderSection('Recomendado para', parsed['Recomendado para'])}
          {renderSection('Evitar en', parsed['Evitar en'])}

          {/* Botones */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
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
        </Box>
      </Box>
    </Container>
  );
};

export default ProductoDetallePage;
