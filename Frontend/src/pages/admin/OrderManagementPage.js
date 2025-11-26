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
  Snackbar,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Avatar,
  alpha,
  useTheme,
  InputAdornment,
  Tab,
  Tabs
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, order: null, field: '' });
  const [boletaDialog, setBoletaDialog] = useState({ open: false, order: null });
  const [newValue, setNewValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);

  const theme = useTheme();
  const boletaRef = useRef();

  // Paleta de colores profesional
  const colors = {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b'
  };

  const statusConfig = {
    Pendiente: {
      color: colors.warning,
      icon: <PendingIcon sx={{ fontSize: 16 }} />,
      variant: 'filled'
    },
    Pagado: {
      color: colors.success,
      icon: <PaymentIcon sx={{ fontSize: 16 }} />,
      variant: 'filled'
    },
    Cancelado: {
      color: colors.error,
      icon: <CancelIcon sx={{ fontSize: 16 }} />,
      variant: 'filled'
    },
    Enviado: {
      color: colors.primary,
      icon: <ShippingIcon sx={{ fontSize: 16 }} />,
      variant: 'filled'
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPedidos();
      setOrders(data);
    } catch (err) {
      setError('Error al cargar los pedidos. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.pedidoID.toString().includes(searchTerm) ||
        order.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.direccionEnvio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.estadoPedido === statusFilter);
    }

    setFilteredOrders(filtered);
  };

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
    setNewValue(order.direccionEnvio || '');
  };

  const handleEditReasons = (order) => {
    setEditDialog({ open: true, order, field: 'motivos' });
    setNewValue(order.motivosCancelacion || '');
  };

  const handleSaveEdit = async () => {
    try {
      if (editDialog.field === 'direccion') {
        await adminService.updateOrderAddress(editDialog.order.pedidoID, newValue);
        setOrders(orders.map(order =>
          order.pedidoID === editDialog.order.pedidoID ? { ...order, direccionEnvio: newValue } : order
        ));
        setSnackbar({ open: true, message: 'Dirección actualizada exitosamente', severity: 'success' });
      } else if (editDialog.field === 'motivos') {
        await adminService.updateOrderReasons(editDialog.order.pedidoID, newValue);
        setOrders(orders.map(order =>
          order.pedidoID === editDialog.order.pedidoID ? { ...order, motivosCancelacion: newValue } : order
        ));
        setSnackbar({ open: true, message: 'Motivos actualizados exitosamente', severity: 'success' });
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

  const getStatusCount = (status) => {
    return orders.filter(order => order.estadoPedido === status).length;
  };

  const OrderCard = ({ order }) => (
    <Card 
      sx={{ 
        mb: 2,
        border: `1px solid ${alpha(colors.primary, 0.1)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(colors.primary, 0.1) }}>
                <PersonIcon sx={{ color: colors.primary, fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color={colors.textLight}>
                  Cliente
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {order.nombreCliente}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color={colors.textLight}>
              ID: #{order.pedidoID}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarIcon sx={{ color: colors.textLight, fontSize: 18 }} />
              <Typography variant="body2">
                {format(new Date(order.fechaPedido), 'dd/MM/yyyy')}
              </Typography>
            </Box>
            <Typography variant="caption" color={colors.textLight}>
              {format(new Date(order.fechaPedido), 'HH:mm')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon sx={{ color: colors.textLight, fontSize: 18 }} />
              <Typography variant="body1" fontWeight="600" color={colors.primary}>
                {formatCurrency(order.totalPedido)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Select
                value={order.estadoPedido}
                onChange={(e) => handleStatusChange(order.pedidoID, e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 120,
                  '& .MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }
                }}
              >
                <MenuItem value="Pendiente">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PendingIcon sx={{ color: colors.warning, fontSize: 16 }} />
                    Pendiente
                  </Box>
                </MenuItem>
                <MenuItem value="Pagado">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentIcon sx={{ color: colors.success, fontSize: 16 }} />
                    Pagado
                  </Box>
                </MenuItem>
                <MenuItem value="Cancelado">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CancelIcon sx={{ color: colors.error, fontSize: 16 }} />
                    Cancelado
                  </Box>
                </MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title="Ver boleta">
                <IconButton
                  size="small"
                  onClick={() => handleViewBoleta(order)}
                  sx={{ 
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    borderRadius: 2
                  }}
                >
                  <VisibilityIcon sx={{ color: colors.primary, fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              {order.estadoPedido === 'Pagado' && (
                <Tooltip title="Editar dirección">
                  <IconButton
                    size="small"
                    onClick={() => handleEditAddress(order)}
                    sx={{ 
                      border: `1px solid ${alpha(colors.primary, 0.2)}`,
                      borderRadius: 2
                    }}
                  >
                    <LocationIcon sx={{ color: colors.primary, fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}

              {order.estadoPedido === 'Cancelado' && (
                <Tooltip title="Editar motivos">
                  <IconButton
                    size="small"
                    onClick={() => handleEditReasons(order)}
                    sx={{ 
                      border: `1px solid ${alpha(colors.primary, 0.2)}`,
                      borderRadius: 2
                    }}
                  >
                    <EditIcon sx={{ color: colors.primary, fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Detalles del pedido */}
        <Accordion 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            boxShadow: 'none',
            border: `1px solid ${alpha(colors.primary, 0.1)}`,
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight="500">
              Ver productos ({order.detalles?.length || 0})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {order.detalles?.map((item) => (
                <Grid item xs={12} key={item.productoID}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(colors.primary, 0.03)
                  }}>
                    <Typography variant="body2" fontWeight="500">
                      {item.nombreProducto}
                    </Typography>
                    <Typography variant="body2" color={colors.textLight}>
                      {item.cantidad} x {formatCurrency(item.precioUnitario)}
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatCurrency(item.cantidad * item.precioUnitario)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color={colors.textLight}>
          Cargando pedidos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${colors.error}`
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="800" 
          gutterBottom
          sx={{ color: colors.text }}
        >
          Gestión de Pedidos
        </Typography>
        <Typography variant="h6" color={colors.textLight}>
          Administra y sigue el estado de todos los pedidos
        </Typography>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.primary, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.primary}>
                {orders.length}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Total Pedidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.warning, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.warning}>
                {getStatusCount('Pendiente')}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.success, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.success}>
                {getStatusCount('Pagado')}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Pagados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.error, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.error}>
                {getStatusCount('Cancelado')}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Cancelados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por ID, cliente o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Select
                fullWidth
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Pagado">Pagado</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={fetchOrders}
                sx={{ borderRadius: 3, height: '56px' }}
              >
                Actualizar Lista
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      {filteredOrders.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h6" color={colors.textLight} gutterBottom>
              No se encontraron pedidos
            </Typography>
            <Typography variant="body2" color={colors.textLight}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Intenta con otros términos de búsqueda' 
                : 'No hay pedidos registrados'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {filteredOrders.map((order) => (
            <OrderCard key={order.pedidoID} order={order} />
          ))}
        </Box>
      )}

      {/* Diálogo de edición */}
      <Dialog 
        open={editDialog.open} 
        onClose={handleCloseDialog}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${alpha(colors.primary, 0.1)}` }}>
          {editDialog.field === 'direccion' ? 'Editar Dirección de Envío' : 'Editar Motivos de Cancelación'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            multiline={editDialog.field === 'motivos'}
            rows={editDialog.field === 'motivos' ? 4 : 2}
            placeholder={
              editDialog.field === 'direccion' 
                ? 'Ingresa la dirección de envío...' 
                : 'Describe los motivos de cancelación...'
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de boleta */}
      <Dialog 
        open={boletaDialog.open} 
        onClose={handleCloseBoletaDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: 'white'
        }}>
          <Typography variant="h5" fontWeight="600">
            Boleta de Venta - Pedido #{boletaDialog.order?.pedidoID}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box ref={boletaRef} sx={{ p: 4, backgroundColor: 'white' }}>
            {/* Encabezado de la boleta */}
            <Box sx={{ textAlign: 'center', mb: 4, borderBottom: `2px solid ${colors.primary}`, pb: 2 }}>
              <Typography variant="h4" fontWeight="800" color={colors.primary} gutterBottom>
                BOLETA DE VENTA
              </Typography>
              <Typography variant="h6" color={colors.textLight}>
                Patitas y Sabores
              </Typography>
            </Box>

            {/* Información del cliente */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: colors.primary }}>
                  Información del Cliente
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><strong>Cliente:</strong> {boletaDialog.order?.nombreCliente}</Typography>
                  <Typography><strong>Fecha:</strong> {boletaDialog.order ? format(new Date(boletaDialog.order.fechaPedido), 'dd/MM/yyyy HH:mm') : ''}</Typography>
                  <Typography><strong>Estado:</strong> 
                    <Chip 
                      label={boletaDialog.order?.estadoPedido} 
                      size="small"
                      sx={{ 
                        ml: 1,
                        backgroundColor: statusConfig[boletaDialog.order?.estadoPedido]?.color || colors.secondary,
                        color: 'white'
                      }}
                    />
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: colors.primary }}>
                  Dirección de Envío
                </Typography>
                <Typography>
                  {boletaDialog.order?.direccionEnvio || 'No especificada'}
                </Typography>
              </Grid>
            </Grid>

            {/* Productos */}
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: colors.primary, mb: 2 }}>
              Productos
            </Typography>
            <TableContainer 
              component={Paper} 
              sx={{ 
                mb: 3,
                border: `1px solid ${alpha(colors.primary, 0.1)}`,
                borderRadius: 2
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.05) }}>
                    <TableCell><strong>Producto</strong></TableCell>
                    <TableCell align="right"><strong>Cantidad</strong></TableCell>
                    <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
                    <TableCell align="right"><strong>Subtotal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boletaDialog.order?.detalles?.map((item) => (
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

            {/* Total */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 3,
              pt: 2,
              borderTop: `2px solid ${colors.primary}`
            }}>
              <Typography variant="h5" fontWeight="800" color={colors.primary}>
                Total: {formatCurrency(boletaDialog.order?.totalPedido || 0)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseBoletaDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cerrar
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadBoleta}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
            }}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 3,
            alignItems: 'center'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderManagementPage;