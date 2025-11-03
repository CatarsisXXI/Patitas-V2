import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Grid, Button, CircularProgress, Chip } from '@mui/material';
import { formatCurrency } from '../utils/formatCurrency';
import pedidoService from '../services/pedidoService';

const MisBoletasPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await pedidoService.getPedidos();
        // Filter only completed orders (those with receipts)
        const pedidosCompletados = data.filter(pedido =>
          pedido.estadoPedido === 'Pagado' ||
          pedido.estadoPedido === 'Enviado' ||
          pedido.estadoPedido === 'Entregado'
        );
        setPedidos(pedidosCompletados);
      } catch (err) {
        setError('Error al cargar las boletas');
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
        <Typography variant="h4" gutterBottom>No tienes boletas disponibles</Typography>
        <Typography variant="subtitle1" gutterBottom>
          Realiza una compra para generar tu primera boleta.
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
        Mis Boletas
      </Typography>

      <Grid container spacing={3}>
        {pedidos.map((pedido) => (
          <Grid item xs={12} md={6} key={pedido.pedidoID}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Boleta #{pedido.pedidoID}
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
                  Total: {formatCurrency(pedido.totalPedido)}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/boleta/${pedido.pedidoID}`}
                    variant="contained"
                    fullWidth
                  >
                    Ver Boleta Completa
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

export default MisBoletasPage;