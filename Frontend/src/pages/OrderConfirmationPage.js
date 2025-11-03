import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    CircularProgress,
    Alert,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Divider
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import pedidoService from '../services/pedidoService';
import { formatCurrency } from '../utils/formatCurrency';

const OrderConfirmationPage = () => {
    const { pedidoId } = useParams();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const data = await pedidoService.getPedidoById(pedidoId);
                setPedido(data);
            } catch (err) {
                setError('No se pudo cargar el detalle del pedido. Es posible que no tengas permiso para verlo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPedido();
    }, [pedidoId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    if (!pedido) {
        return <Alert severity="warning" sx={{ m: 4 }}>Pedido no encontrado.</Alert>;
    }

    // Calculations
    const subtotal = pedido.detalles.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    return (
        <Container sx={{ py: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 4 }, my: 4, borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <PetsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        ¡Gracias por tu compra!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Tu pedido ha sido confirmado. ¡Tu mascota te lo agradecerá!
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom><strong>Pedido #{pedido.pedidoID}</strong></Typography>
                        <Typography variant="body2"><strong>Fecha:</strong> {format(new Date(pedido.fechaPedido), 'dd MMMM yyyy, HH:mm', { locale: es })}</Typography>
                        <Typography variant="body2"><strong>Estado:</strong> {pedido.estadoPedido}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom><strong>Enviar a:</strong></Typography>
                        <Typography variant="body2"><strong>Cliente:</strong> {pedido.nombreCliente}</Typography>
                        <Typography variant="body2"><strong>Dirección:</strong> {pedido.direccionEnvio}</Typography>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Resumen de la Compra
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Precio Unit.</TableCell>
                                <TableCell align="right">Importe</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pedido.detalles.map((item) => (
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

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Box sx={{ width: { xs: '100%', sm: '280px' } }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography>Subtotal:</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography>{formatCurrency(subtotal)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>IGV (18%):</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography>{formatCurrency(igv)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6"><strong>Total a Pagar:</strong></Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="h6"><strong>{formatCurrency(total)}</strong></Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button component={Link} to="/productos" variant="outlined">
                        Seguir Comprando
                    </Button>
                    <Button component={Link} to={`/boleta/${pedido.pedidoID}`} variant="contained">
                        Ver Boleta
                    </Button>
                </Box>
            </Paper>
        </Container>

    );
};

export default OrderConfirmationPage;