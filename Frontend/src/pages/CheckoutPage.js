import React, { forwardRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useCart } from '../context/CartContext';
import pedidoService from '../services/pedidoService';
import { errorMessage } from '../config/api';
import { formatCurrency } from '../utils/formatCurrency';
import { splitNombre } from '../lib/productCopy';
import { color, radius } from '../theme/tokens';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

/** Adapta PatternFormat a los TextField de MUI entregando el valor sin máscara. */
const masked = (format, placeholder) =>
  forwardRef(function MaskedInput({ onChange, name, ...other }, ref) {
    return <PatternFormat {...other} name={name} getInputRef={ref} format={format} placeholder={placeholder} onValueChange={(values) => onChange({ target: { name, value: values.value } })} />;
  });

const CardNumberInput = masked('#### #### #### ####', '0000 0000 0000 0000');
const CardExpiryInput = masked('##/##', 'MM/AA');
const CardCvvInput = masked('###', '123');

const validate = (form) => {
  const errors = {};
  if (!form.direccionEnvio.trim()) errors.direccionEnvio = 'Indica la dirección de envío.';
  else if (form.direccionEnvio.trim().length < 10) errors.direccionEnvio = 'Escribe la dirección completa (mínimo 10 caracteres).';
  if (!form.nombreTitular.trim()) errors.nombreTitular = 'Indica el nombre del titular.';
  if (form.numeroTarjeta.length !== 16) errors.numeroTarjeta = 'El número de tarjeta tiene 16 dígitos.';
  if (form.fechaExpiracion.length !== 4) errors.fechaExpiracion = 'Usa el formato MM/AA.';
  if (form.cvv.length !== 3) errors.cvv = 'El CVV tiene 3 dígitos.';
  return errors;
};

const CheckoutPage = () => {
  const { items, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ direccionEnvio: '', nombreTitular: '', numeroTarjeta: '', fechaExpiracion: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const sinStock = items.filter((item) => item.stock != null && item.cantidad > item.stock);
    if (sinStock.length > 0) {
      setServerError(`No hay stock suficiente de: ${sinStock.map((item) => item.nombreProducto).join(', ')}. Actualiza tu carrito.`);
      return;
    }

    setProcessing(true);
    try {
      const response = await pedidoService.crearPedido({
        direccionEnvio: form.direccionEnvio.trim(),
        metodoPago: { nombreTitular: form.nombreTitular.trim(), numeroTarjeta: form.numeroTarjeta, fechaExpiracion: form.fechaExpiracion, cvv: form.cvv },
      });
      await fetchCart();
      navigate(`/pedido-confirmado/${response.pedidoId}`);
    } catch (error) {
      setServerError(errorMessage(error, 'No pudimos procesar el pago.'));
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBagOutlinedIcon />}
        title="Tu carrito está vacío"
        description="Agrega productos antes de pagar."
        action={
          <Button component={Link} to="/productos" variant="contained" size="large">
            Ver catálogo
          </Button>
        }
      />
    );
  }

  const field = (name, label, extra = {}) => ({ name, label, value: form[name], onChange: handleChange, fullWidth: true, required: true, error: !!errors[name], helperText: errors[name] || ' ', ...extra });

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <PageHeader
        crumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Carrito', to: '/carrito' },
        ]}
        current="Pago"
        title="Finalizar compra"
      />

      <Box sx={{ display: 'grid', gap: { xs: 4, md: 7 }, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 380px' }, alignItems: 'start' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Envío
          </Typography>
          <TextField {...field('direccionEnvio', 'Dirección de envío')} autoComplete="street-address" placeholder="Calle, número, distrito y referencia" />

          <Typography variant="h4" component="h2" sx={{ mt: 2, mb: 2 }}>
            Tarjeta de crédito o débito
          </Typography>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField {...field('nombreTitular', 'Nombre del titular')} autoComplete="cc-name" />
            <TextField {...field('numeroTarjeta', 'Número de tarjeta')} slotProps={{ input: { inputComponent: CardNumberInput }, htmlInput: { inputMode: 'numeric', autoComplete: 'cc-number' } }} />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <TextField {...field('fechaExpiracion', 'Vencimiento')} slotProps={{ input: { inputComponent: CardExpiryInput }, htmlInput: { inputMode: 'numeric', autoComplete: 'cc-exp' } }} />
              <TextField {...field('cvv', 'CVV')} slotProps={{ input: { inputComponent: CardCvvInput }, htmlInput: { inputMode: 'numeric', autoComplete: 'cc-csc' } }} />
            </Box>
          </Box>

          {serverError && (
            <Alert severity="error" role="alert" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Button type="submit" variant="contained" size="large" fullWidth disabled={processing} startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon />}>
            {processing ? 'Procesando pago…' : `Pagar ${formatCurrency(total)}`}
          </Button>
        </Box>

        <Box component="aside" aria-label="Resumen de tu orden" sx={{ position: { md: 'sticky' }, top: { md: 'calc(var(--nav-h) + 24px)' }, p: { xs: 3, md: 3.5 }, borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}` }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Tu orden
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.25 }}>
            {items.map((item) => (
              <Box key={item.productoID} component="li" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="body2">
                  {splitNombre(item.nombreProducto).titulo}{' '}
                  <Box component="span" sx={{ color: color.inkMuted }}>
                    × {item.cantidad}
                  </Box>
                </Typography>
                <Typography variant="body2" className="tabular" sx={{ fontWeight: 600 }}>
                  {formatCurrency(item.precioUnitario * item.cantidad)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ my: 2, borderTop: `1px dashed ${color.lineStrong}` }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography sx={{ fontWeight: 650 }}>Total</Typography>
            <Typography className="tabular" sx={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              {formatCurrency(total)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
