import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Button, 
  CircularProgress, 
  TextField, 
  Snackbar, 
  Alert, 
  Tooltip,
  Fade,
  Zoom,
  Grow,
  Paper,
  Divider,
  Chip,
  Breadcrumbs
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import { formatCurrency } from '../utils/formatCurrency';
import pedidoService from '../services/pedidoService';
import productService from '../services/productService'; // Importamos el servicio de productos
import { Link as RouterLink } from 'react-router-dom';

const CarritoPage = () => {
  const { cart, removeProductFromCart, updateProductQuantity, loading, clearCart } = useCart();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [productsStock, setProductsStock] = useState({}); // Estado para almacenar el stock de cada producto

  // Efecto para cargar el stock de los productos en el carrito
  useEffect(() => {
    const fetchStockForProducts = async () => {
      if (!cart || !cart.items) return;

      const stockData = {};
      // Por cada item en el carrito, obtenemos el producto para tener el stock actual
      for (const item of cart.items) {
        try {
          const product = await productService.getProductoById(item.productoID);
          stockData[item.productoID] = product.stock; // Asumimos que la API devuelve un campo `stock`
        } catch (error) {
          console.error(`Error al obtener el stock del producto ${item.productoID}:`, error);
          stockData[item.productoID] = 0; // En caso de error, ponemos 0
        }
      }
      setProductsStock(stockData);
    };

    fetchStockForProducts();
  }, [cart]); // Se ejecuta cuando el carrito cambia

  // Función para obtener el stock de un producto
  const getStockForProduct = (productoID) => {
    return productsStock[productoID] !== undefined ? productsStock[productoID] : 0;
  };

  const handleComprar = async () => {
    setProcessingOrder(true);
    
    try {
      // Generate WhatsApp message
      const message = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/51956550376?text=${encodeURIComponent(message)}`;

      // Create pending order and clear cart
      await createPendingOrder();
      clearCart(); // Clear cart after creating order
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setErrorMessage('Error al procesar la compra. Por favor, intenta nuevamente.');
      setOpenSnackbar(true);
    } finally {
      setProcessingOrder(false);
    }
  };

  const generateWhatsAppMessage = () => {
    let message = '¡Hola! 👋\n\n';
    message += 'Me gustaría realizar el siguiente pedido en *Patitas y Sabores*:\n\n';
    message += '📦 *DETALLE DEL PEDIDO*\n';
    
    cart.items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.nombreProducto}*\n`;
      message += `   Cantidad: ${item.cantidad}\n`;
      message += `   Precio: ${formatCurrency(item.precioUnitario * item.cantidad)}\n`;
    });
    
    message += `\n💰 *TOTAL A PAGAR: ${formatCurrency(cart.total)}*\n\n`;
    message += 'Por favor, confírmenme la disponibilidad de los productos y las opciones de pago y envío.\n\n';
    message += '¡Gracias! 🐾';
    
    return message;
  };

  const createPendingOrder = async () => {
    await pedidoService.createPendingOrder();
  };

  const handleQuantityChange = async (productoID, newQuantity) => {
    if (newQuantity < 1) {
      setErrorMessage('La cantidad debe ser al menos 1.');
      setOpenSnackbar(true);
      return;
    }
    const item = cart.items.find(i => i.productoID === productoID);
    if (!item) return;

    // Usamos el stock actualizado
    const currentStock = getStockForProduct(item.productoID);
    if (newQuantity > currentStock) {
      setErrorMessage(`Stock insuficiente. Solo quedan ${currentStock} unidades de ${item.nombreProducto}.`);
      setOpenSnackbar(true);
      return;
    }

    try {
      await updateProductQuantity(productoID, newQuantity);
    } catch (error) {
      setErrorMessage('Error al actualizar la cantidad. Stock insuficiente.');
      setOpenSnackbar(true);
    }
  };

  const handleRemoveItem = async (productoID, productName) => {
    try {
      await removeProductFromCart(productoID);
      setErrorMessage(`${productName} eliminado del carrito`);
      setOpenSnackbar(true);
    } catch (error) {
      setErrorMessage('Error al eliminar el producto del carrito.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading && !cart) {
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
          Cargando tu carrito...
        </Typography>
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ maxWidth: 500, mx: 'auto', py: 8 }}>
            <ShoppingBagIcon 
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
              Tu carrito está vacío
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#7D6B5D', 
                mb: 4,
                lineHeight: 1.6
              }}
            >
              ¡Descubre nuestros deliciosos snacks naturales para tu mascota! 
              Tenemos opciones saludables que ellos adorarán.
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
            <ShoppingBagIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Carrito de Compras
          </Typography>
        </Breadcrumbs>

        {/* Header */}
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
              Tu Carrito
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#7D6B5D',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Revisa y confirma los productos seleccionados para tu mascota
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Products Column - IZQUIERDA */}
          <Grid item xs={12} md={8} lg={8} sx={{ order: { xs: 2, md: 1 } }}>
            <Fade in={true} timeout={1000}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                  boxShadow: '0 8px 32px rgba(93, 78, 55, 0.08)',
                  border: '1px solid rgba(212, 165, 116, 0.2)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ShoppingBagIcon sx={{ color: '#5D4E37', mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                    Productos ({cart.items.length})
                  </Typography>
                </Box>

                {cart.items.map((item, index) => {
                  const currentStock = getStockForProduct(item.productoID);
                  return (
                    <Grow in={true} timeout={500 + index * 100} key={item.productoID}>
                      <Card 
                        sx={{ 
                          display: 'flex', 
                          mb: 3, 
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 4px 20px rgba(93, 78, 55, 0.06)',
                          border: '1px solid rgba(212, 165, 116, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 6px 25px rgba(93, 78, 55, 0.12)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ 
                            width: 140, 
                            objectFit: 'cover',
                            borderRadius: '16px 0 0 16px'
                          }}
                          image={`http://localhost:5288/${item.imagenURL}`}
                          alt={item.nombreProducto}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
                          <CardContent sx={{ flex: '1 0 auto', p: 0, pb: 1 }}>
                            <Typography 
                              component="div" 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#5D4E37',
                                mb: 1
                              }}
                            >
                              {item.nombreProducto}
                            </Typography>

                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#5D4E37', 
                                  fontWeight: 600, 
                                  mr: 2 
                                }}
                              >
                                Cantidad:
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title="Reducir cantidad">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item.productoID, item.cantidad - 1)}
                                    disabled={item.cantidad <= 1}
                                    sx={{
                                      backgroundColor: 'rgba(93, 78, 55, 0.1)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(93, 78, 55, 0.2)',
                                      },
                                      '&.Mui-disabled': {
                                        backgroundColor: 'rgba(93, 78, 55, 0.05)',
                                      }
                                    }}
                                  >
                                    <RemoveIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                                
                                <TextField
                                  type="number"
                                  value={item.cantidad}
                                  onChange={(e) => handleQuantityChange(item.productoID, parseInt(e.target.value, 10))}
                                  inputProps={{ 
                                    min: 1, 
                                    max: currentStock,
                                    style: { textAlign: 'center', fontWeight: 600 }
                                  }}
                                  sx={{ 
                                    width: 70, 
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    }
                                  }}
                                  size="small"
                                />
                                
                                <Tooltip title="Aumentar cantidad">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item.productoID, item.cantidad + 1)}
                                    disabled={item.cantidad >= currentStock}
                                    sx={{
                                      backgroundColor: 'rgba(93, 78, 55, 0.1)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(93, 78, 55, 0.2)',
                                      },
                                      '&.Mui-disabled': {
                                        backgroundColor: 'rgba(93, 78, 55, 0.05)',
                                      }
                                    }}
                                  >
                                    <AddIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>

                            {/* Stock and Price - CORREGIDO: Mostrar stock real */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Chip
                                  label={`Stock: ${currentStock}`}
                                  size="small"
                                  color={
                                    currentStock > 10 ? "success" : 
                                    currentStock > 0 ? "warning" : "error"
                                  }
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 800,
                                  color: '#5D4E37',
                                  background: 'linear-gradient(135deg, #5D4E37 0%, #8A7B5D 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                }}
                              >
                                {formatCurrency(item.precioUnitario * item.cantidad)}
                              </Typography>
                            </Box>
                          </CardContent>
                          
                          {/* Delete Button */}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title="Eliminar del carrito">
                              <IconButton 
                                onClick={() => handleRemoveItem(item.productoID, item.nombreProducto)}
                                sx={{
                                  color: '#F44336',
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Card>
                    </Grow>
                  );
                })}
              </Paper>
            </Fade>
          </Grid>

          {/* Order Summary Column - DERECHA - MEJORADO PARA STICKY */}
          <Grid item xs={12} md={4} lg={4} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                position: 'sticky',
                top: 100, // Distancia desde la parte superior
                zIndex: 10,
              }}
            >
              <Zoom in={true} timeout={1200}>
                <Card 
                  sx={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                    boxShadow: '0 8px 40px rgba(93, 78, 55, 0.12)',
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PriceCheckIcon sx={{ color: '#5D4E37', mr: 1.5, fontSize: 28 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                        Resumen del Pedido
                      </Typography>
                    </Box>

                    {/* Order Details */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#7D6B5D' }}>
                          Subtotal ({cart.items.length} productos)
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#5D4E37' }}>
                          {formatCurrency(cart.total)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalShippingIcon sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }} />
                          <Typography variant="body1" sx={{ color: '#7D6B5D' }}>
                            Envío
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#4CAF50',
                            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          Gratis
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#5D4E37' }}>
                          Total
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 800,
                            color: '#5D4E37',
                            background: 'linear-gradient(135deg, #5D4E37 0%, #8A7B5D 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {formatCurrency(cart.total)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Checkout Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleComprar}
                      disabled={processingOrder}
                      startIcon={processingOrder ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <WhatsAppIcon />}
                      sx={{
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#128C7E',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(37, 211, 102, 0.5)',
                        }
                      }}
                    >
                      {processingOrder ? 'Procesando...' : 'Completar Pedido por WhatsApp'}
                    </Button>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center', 
                        mt: 2, 
                        color: '#7D6B5D',
                        fontStyle: 'italic'
                      }}
                    >
                      Serás redirigido a WhatsApp para confirmar tu pedido
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Box>
          </Grid>
        </Grid>

        {/* Continue Shopping */}
        <Fade in={true} timeout={1600}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/productos"
              variant="outlined"
              startIcon={<StoreIcon />}
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
              Seguir Comprando
            </Button>
          </Box>
        </Fade>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {errorMessage}
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

export default CarritoPage;