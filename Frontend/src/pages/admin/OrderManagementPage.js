import React, { useState, useEffect, useRef } from 'react';
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
  AccordionDetails,
  Select,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, order: null, field: '' });
  const [boletaDialog, setBoletaDialog] = useState({ open: false, order: null });
  const [newValue, setNewValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const boletaRef = useRef();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.pedidoID === orderId ? { ...order, estadoPedido: newStatus } : order
      ));
      setSnackbar({ open: true, message: 'Estado actualizado exitosamente', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar estado', severity: 'error' });
    }
  };

  const handleEditAddress = (order) => {
    setEditDialog({ open: true, order, field: 'direccion' });
    setNewValue(order.direccionEnvio);
  };

  const handleSaveEdit = async () => {
    try {
      if (editDialog.field === 'direccion') {
        await adminService.updateOrderAddress(editDialog.order.pedidoID, newValue);
        setOrders(orders.map(order =>
          order.pedidoID === editDialog.order.pedidoID ? { ...order, direccionEnvio: newValue } : order
        ));
        setSnackbar({ open: true, message: 'Dirección actualizada exitosamente', severity: 'success' });
      }
      setEditDialog({ open: false, order: null, field: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar', severity: 'error' });
    }
  };

  const handleViewBoleta = (order) => {
    setBoletaDialog({ open: true, order });
  };

  const handleDownloadBoleta = async () => {
    if (boletaRef.current) {
      try {
        const canvas = await html2canvas(boletaRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`boleta_pedido_${boletaDialog.order?.pedidoID}.pdf`);
        setSnackbar({ open: true, message: 'Boleta descargada exitosamente', severity: 'success' });
      } catch (error) {
        console.error('Error al generar PDF:', error);
        setSnackbar({ open: true, message: 'Error al descargar la boleta', severity: 'error' });
      }
    }
  };

  const handleCloseBoletaDialog = () => {
    setBoletaDialog({ open: false, order: null });
  };

  const handleCloseDialog = () => {
    setEditDialog({ open: false, order: null, field: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

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
                  <TableCell>
                    <Select
                      value={order.estadoPedido}
                      onChange={(e) => handleStatusChange(order.pedidoID, e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: order.estadoPedido === 'Pendiente' ? '#fff3cd' :
                                         order.estadoPedido === 'Pagado' ? '#d4edda' :
                                         order.estadoPedido === 'Cancelado' ? '#f8d7da' : 'transparent',
                        color: order.estadoPedido === 'Pendiente' ? '#856404' :
                               order.estadoPedido === 'Pagado' ? '#155724' :
                               order.estadoPedido === 'Cancelado' ? '#721c24' : 'inherit'
                      }}
                    >
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                      <MenuItem value="Pagado">Pagado</MenuItem>
                      <MenuItem value="Cancelado">Cancelado</MenuItem>
                    </Select>
                    {order.estadoPedido === 'Pagado' && (
                      <>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditAddress(order)}
                          sx={{ ml: 1 }}
                        >
                          Dirección
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleViewBoleta(order)}
                          sx={{ ml: 1 }}
                        >
                          Ver Boleta
                        </Button>
                      </>
                    )}
                    {order.estadoPedido === 'Cancelado' && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditAddress(order)}
                        sx={{ ml: 1 }}
                      >
                        Motivos
                      </Button>
                    )}
                  </TableCell>
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

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>
          Editar {editDialog.order?.estadoPedido === 'Pagado' ? 'Dirección de Envío' : editDialog.order?.estadoPedido === 'Cancelado' ? 'Motivos de Cancelación' : ''}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={editDialog.order?.estadoPedido === 'Pagado' ? 'Dirección de Envío' : editDialog.order?.estadoPedido === 'Cancelado' ? 'Motivos de Cancelación' : ''}
            fullWidth
            variant="outlined"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            multiline={editDialog.order?.estadoPedido === 'Cancelado'}
            rows={editDialog.order?.estadoPedido === 'Cancelado' ? 4 : 1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Boleta Dialog */}
      <Dialog open={boletaDialog.open} onClose={handleCloseBoletaDialog} maxWidth="md" fullWidth>
        <DialogTitle>Boleta de Venta - Pedido #{boletaDialog.order?.pedidoID}</DialogTitle>
        <DialogContent>
          <Box ref={boletaRef} sx={{ p: 2, backgroundColor: 'white' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
              BOLETA DE VENTA
            </Typography>
            <Typography variant="h6" gutterBottom>Información del Cliente</Typography>
            <Typography>Cliente: {boletaDialog.order?.nombreCliente}</Typography>
            <Typography>Fecha: {boletaDialog.order ? format(new Date(boletaDialog.order.fechaPedido), 'dd/MM/yyyy HH:mm') : ''}</Typography>
            <Typography>Dirección de Envío: {boletaDialog.order?.direccionEnvio}</Typography>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Productos</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boletaDialog.order?.detalles.map((item) => (
                    <TableRow key={item.productoID}>
                      <TableCell>{item.nombreProducto}</TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">{formatCurrency(item.precioUnitario)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.cantidad * item.precioUnitario)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Typography variant="h6">Total: {formatCurrency(boletaDialog.order?.totalPedido || 0)}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadBoleta}
            variant="contained"
            color="primary"
          >
            Descargar PDF
          </Button>
          <Button onClick={handleCloseBoletaDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderManagementPage;