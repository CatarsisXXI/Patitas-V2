import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Grid, Button, CircularProgress, Chip } from '@mui/material';
import { formatCurrency } from '../utils/formatCurrency';
import pedidoService from '../services/pedidoService';

const MisComprasPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await pedidoService.getPedidos();
        setPedidos(data);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error('Error fetching pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Enviado':
        return 'primary';
      case 'Entregado':
        return 'secondary';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (pedidos.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>No tienes compras realizadas</Typography>
        <Typography variant="subtitle1" gutterBottom>
          ¡Empieza a comprar productos para tus mascotas!
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
        Mis Compras
      </Typography>

      <Grid container spacing={3}>
        {pedidos.map((pedido) => (
          <Grid item xs={12} key={pedido.pedidoID}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Pedido #{pedido.pedidoID}
                  </Typography>
                  <Chip
                    label={pedido.estadoPedido}
                    color={getStatusColor(pedido.estadoPedido)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fecha: {new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  Dirección de envío: {pedido.direccionEnvio}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Productos:
                </Typography>

                {pedido.detalles.map((detalle) => (
                  <Box key={detalle.productoID} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {detalle.nombreProducto} (x{detalle.cantidad})
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(detalle.precioUnitario * detalle.cantidad)}
                    </Typography>
                  </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                  <Typography variant="h6">
                    Total: {formatCurrency(pedido.totalPedido)}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/boleta/${pedido.pedidoID}`}
                    variant="outlined"
                    size="small"
                  >
                    Ver Boleta
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MisComprasPage;