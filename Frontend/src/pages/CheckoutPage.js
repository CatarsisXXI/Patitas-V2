import React, { useState, useContext, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';
import { Container, Typography, Button, Box, Grid, TextField, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { CartContext } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import pedidoService from '../services/pedidoService';

// Custom format components for react-number-format with Material-UI
const CardNumberFormat = forwardRef(function CardNumberFormat(props, ref) {
    const { onChange, ...other } = props;
    return (
        <PatternFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value, // unformatted value
                    },
                });
            }}
            format="#### #### #### ####"
            placeholder="0000 0000 0000 0000"
        />
    );
});

const CardExpiryFormat = forwardRef(function CardExpiryFormat(props, ref) {
    const { onChange, ...other } = props;
    return (
        <PatternFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format="##/##"
            placeholder="MM/YY"
        />
    );
});

const CardCvvFormat = forwardRef(function CardCvvFormat(props, ref) {
    const { onChange, ...other } = props;
    return (
        <PatternFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format="###"
            placeholder="123"
        />
    );
});


const CheckoutPage = () => {
    const { cart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        direccionEnvio: '',
        nombreTitular: '',
        numeroTarjeta: '',
        fechaExpiracion: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.direccionEnvio.trim()) newErrors.direccionEnvio = 'La dirección de envío es obligatoria.';
        if (!formData.nombreTitular.trim()) newErrors.nombreTitular = 'El nombre del titular es obligatorio.';
        if (formData.numeroTarjeta.length !== 16) newErrors.numeroTarjeta = 'El número de tarjeta debe tener 16 dígitos.';
        if (formData.fechaExpiracion.length !== 4) newErrors.fechaExpiracion = 'La fecha debe tener el formato MM/YY.';
        if (formData.cvv.length !== 3) newErrors.cvv = 'El CVV debe tener 3 dígitos.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validate()) {
            return;
        }

        // Check stock availability before processing
        const stockIssues = cart.items.filter(item => item.cantidad > item.stock);
        if (stockIssues.length > 0) {
            const productNames = stockIssues.map(item => item.nombreProducto).join(', ');
            setServerError(`No hay suficiente stock para los siguientes productos: ${productNames}. Por favor, actualiza tu carrito.`);
            return;
        }

        setIsProcessing(true);

        // We send the unformatted data
        const pedidoData = {
            direccionEnvio: formData.direccionEnvio,
            metodoPago: {
                nombreTitular: formData.nombreTitular,
                numeroTarjeta: formData.numeroTarjeta,
                fechaExpiracion: formData.fechaExpiracion.replace('/', ''), // Remove slash for backend
                cvv: formData.cvv
            }
        };

        try {
            const response = await pedidoService.crearPedido(pedidoData);
            fetchCart(); // Clear cart in the context
            navigate(`/pedido-confirmado/${response.pedidoId}`); // Redirect to confirmation page
        } catch (err) {
            const errorMessage = (typeof err.response?.data === 'string' && err.response.data)
                || err.response?.data?.message
                || 'Error al procesar el pago.';
            setServerError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Tu carrito está vacío</Typography>
                <Button onClick={() => navigate('/productos')} variant="contained" sx={{ mt: 2 }}>
                    Ir a comprar
                </Button>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Finalizar Compra
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                        Información de Envío y Pago
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Dirección de Envío"
                            name="direccionEnvio"
                            value={formData.direccionEnvio}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.direccionEnvio}
                            helperText={errors.direccionEnvio}
                        />
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Tarjeta de Crédito/Débito
                        </Typography>
                        <TextField
                            label="Nombre del Titular"
                            name="nombreTitular"
                            value={formData.nombreTitular}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.nombreTitular}
                            helperText={errors.nombreTitular}
                        />
                        <TextField
                            label="Número de Tarjeta"
                            name="numeroTarjeta"
                            value={formData.numeroTarjeta}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            error={!!errors.numeroTarjeta}
                            helperText={errors.numeroTarjeta}
                            InputProps={{
                                inputComponent: CardNumberFormat,
                            }}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Fecha de Expiración"
                                    name="fechaExpiracion"
                                    value={formData.fechaExpiracion}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    error={!!errors.fechaExpiracion}
                                    helperText={errors.fechaExpiracion}
                                    InputProps={{
                                        inputComponent: CardExpiryFormat,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="CVV"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                    InputProps={{
                                        inputComponent: CardCvvFormat,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {serverError && <Alert severity="error" sx={{ mt: 2 }}>{serverError}</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3 }}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <CircularProgress size={24} /> : `Pagar ${formatCurrency(cart.total)}`}
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Resumen de tu orden
                            </Typography>
                            {cart.items.map(item => (
                                <Box key={item.productoID} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{item.nombreProducto} x {item.cantidad}</Typography>
                                    <Typography variant="body2">{formatCurrency(item.precioUnitario * item.cantidad)}</Typography>
                                </Box>
                            ))}
                            <hr />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">{formatCurrency(cart.total)}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;