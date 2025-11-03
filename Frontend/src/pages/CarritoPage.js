import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, IconButton, Button, CircularProgress, TextField, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { formatCurrency } from '../utils/formatCurrency';

const CarritoPage = () => {
  const { cart, removeProductFromCart, updateProductQuantity, loading } = useCart();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = async (productoID, newQuantity) => {
    if (newQuantity < 1) {
      setErrorMessage('La cantidad debe ser al menos 1.');
      setOpenSnackbar(true);
      return;
    }
    const item = cart.items.find(i => i.productoID === productoID);
    if (!item) return;

    if (newQuantity > item.stock) {
      setErrorMessage('No hay suficiente stock para la cantidad solicitada.');
      setOpenSnackbar(true);
      return;
    }

    try {
      await updateProductQuantity(productoID, newQuantity);
    } catch (error) {
      setErrorMessage('Error al actualizar la cantidad.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading && !cart) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Tu carrito está vacío</Typography>
        <Typography variant="subtitle1" gutterBottom>
          ¿No sabes qué comprar? ¡Miles de productos te esperan!
        </Typography>
        <Button component={Link} to="/productos" variant="contained" sx={{ mt: 2 }}>
          Ver Productos
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tu Carrito de Compras
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Card key={item.productoID} sx={{ display: 'flex', mb: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={item.imagenURL || 'https://via.placeholder.com/151'}
                alt={item.nombreProducto}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent>
                  <Typography component="div" variant="h6">
                    {item.nombreProducto}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.productoID, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(item.productoID, parseInt(e.target.value, 10))}
                      inputProps={{ min: 1, max: item.stock }}
                      sx={{ width: 80, mx: 1 }}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.productoID, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Stock disponible: {item.stock}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {formatCurrency(item.precioUnitario * item.cantidad)}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                  <IconButton aria-label="delete" onClick={() => removeProductFromCart(item.productoID)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Resumen del Pedido
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">{formatCurrency(cart.total)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Envío</Typography>
                <Typography variant="body1">Gratis</Typography>
              </Box>
              <hr />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatCurrency(cart.total)}</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleCheckout}
              >
                Proceder al Pago
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CarritoPage;