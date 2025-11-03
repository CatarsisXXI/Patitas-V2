import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await adminService.getPedidos();
        setOrders(data);
      } catch (err) {
        setError('Error al cargar los pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Pedidos
      </Typography>

      {orders.length === 0 ? (
        <Typography>No hay pedidos para mostrar.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pedido</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Detalles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.pedidoID}>
                  <TableCell>{order.pedidoID}</TableCell>
                  <TableCell>{order.nombreCliente}</TableCell>
                  <TableCell>{format(new Date(order.fechaPedido), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{formatCurrency(order.totalPedido)}</TableCell>
                  <TableCell>{order.estadoPedido}</TableCell>
                  <TableCell>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body2">Ver productos</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          {order.detalles.map((item) => (
                            <Box key={item.productoID} sx={{ mb: 1 }}>
                              <Typography variant="body2">
                                {item.nombreProducto} ({item.cantidad} x {formatCurrency(item.precioUnitario)})
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderManagementPage;