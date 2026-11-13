import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Container, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import pedidoService from '../services/pedidoService';
import productService from '../services/productService';
import { assetUrl, errorMessage } from '../config/api';
import { site, whatsappUrl } from '../config/site';
import { formatCurrency } from '../utils/formatCurrency';
import { splitNombre } from '../lib/productCopy';
import { color, ease, radius, whatsappButtonSx } from '../theme/tokens';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import QuantityStepper from '../components/ui/QuantityStepper';
import SmartImage from '../components/ui/SmartImage';

/** Texto del pedido que se envía por WhatsApp para confirmarlo. */
const buildWhatsAppMessage = (items, total) => {
  const lines = items.map(
    (item, index) => `${index + 1}. *${item.nombreProducto}*\n   Cantidad: ${item.cantidad}\n   Precio: ${formatCurrency(item.precioUnitario * item.cantidad)}`
  );
  return [
    'Hola,',
    '',
    `Me gustaría realizar el siguiente pedido en *${site.name}*:`,
    '',
    '*DETALLE DEL PEDIDO*',
    '',
    lines.join('\n\n'),
    '',
    `*TOTAL A PAGAR: ${formatCurrency(total)}*`,
    '',
    'Por favor, confírmenme la disponibilidad de los productos y las opciones de pago y envío.',
    '',
    'Gracias.',
  ].join('\n');
};

const SummaryRow = ({ label, value, strong }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, py: 0.75 }}>
    <Typography color={strong ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: strong ? 650 : 400 }}>
      {label}
    </Typography>
    <Typography className="tabular" sx={{ fontWeight: strong ? 700 : 600, fontSize: strong ? '1.5rem' : '1rem', letterSpacing: strong ? '-0.02em' : 0 }}>
      {value}
    </Typography>
  </Box>
);

const CarritoPage = () => {
  const { items, total, itemCount, loading, removeProductFromCart, updateProductQuantity, clearCart } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [stockById, setStockById] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Stock actual de cada producto para limitar la cantidad antes de pedir.
  const ids = useMemo(() => items.map((item) => item.productoID).join(','), [items]);
  useEffect(() => {
    if (!ids) return undefined;
    let cancelled = false;
    Promise.all(
      ids.split(',').map((id) =>
        productService
          .getProductoById(id)
          .then((product) => [id, product?.stock ?? 0])
          .catch(() => [id, null])
      )
    ).then((entries) => !cancelled && setStockById(Object.fromEntries(entries)));
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const run = async (productoID, action, fallback) => {
    setBusyId(productoID);
    try {
      await action();
    } catch (error) {
      notify(errorMessage(error, fallback), { severity: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const overStock = items.filter((item) => stockById[item.productoID] != null && item.cantidad > stockById[item.productoID]);

  const handleComprar = async () => {
    // La pestaña se abre dentro del clic para que el navegador no la bloquee como ventana emergente.
    const chat = window.open('', '_blank');
    const url = whatsappUrl(buildWhatsAppMessage(items, total));
    setProcessing(true);
    try {
      await pedidoService.createPendingOrder();
      clearCart();
      if (chat) chat.location.href = url;
      else window.location.href = url;
      notify('Pedido registrado. Termina de confirmarlo en WhatsApp.');
      navigate('/mis-compras');
    } catch (error) {
      if (chat) chat.close();
      notify(errorMessage(error, 'No pudimos registrar el pedido. Inténtalo nuevamente.'), { severity: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        <Skeleton width={260} height={56} sx={{ mb: 4 }} />
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 380px' } }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {[0, 1].map((i) => (
              <Skeleton key={i} variant="rounded" height={132} />
            ))}
          </Box>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBagOutlinedIcon />}
        title="Tu carrito está vacío"
        description="Explora el catálogo y agrega los snacks que quieras probar."
        action={
          <Button component={Link} to="/productos" variant="contained" size="large">
            Ver catálogo
          </Button>
        }
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <PageHeader
        crumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Catálogo', to: '/productos' },
        ]}
        current="Carrito"
        title="Tu carrito"
        description={itemCount === 1 ? '1 producto listo para pedir.' : `${itemCount} productos listos para pedir.`}
      />

      <Box sx={{ display: 'grid', gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 380px' }, alignItems: 'start' }}>
        <Box component="ul" aria-label="Productos en el carrito" sx={{ listStyle: 'none', m: 0, p: 0, borderTop: `1px solid ${color.line}` }}>
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const { titulo, detalle } = splitNombre(item.nombreProducto);
              const stock = stockById[item.productoID];
              const busy = busyId === item.productoID;
              const exceeds = stock != null && item.cantidad > stock;
              return (
                <Box
                  key={item.productoID}
                  component={motion.li}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.2, ease: 'easeIn' } }}
                  transition={{ duration: 0.35, ease: ease.out }}
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '88px 1fr', sm: '116px 1fr auto' }, columnGap: { xs: 2, sm: 3 }, rowGap: 1.5, py: 3, borderBottom: `1px solid ${color.line}`, opacity: busy ? 0.6 : 1, transition: 'opacity 160ms ease' }}
                >
                  <Box component={Link} to={`/productos/${item.productoID}`} aria-label={`Ver ${titulo}`} sx={{ gridRow: { xs: 'span 2', sm: 'auto' } }}>
                    <SmartImage src={assetUrl(item.imagenURL)} alt="" ratio={1} fit="contain" blend radius={radius.md} imgSx={{ p: 1 }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography component={Link} to={`/productos/${item.productoID}`} variant="h5" sx={{ display: 'block', color: 'text.primary', '&:hover': { textDecoration: 'underline', textUnderlineOffset: 3 } }}>
                      {titulo}
                    </Typography>
                    {detalle && (
                      <Typography variant="body2" color="text.secondary">
                        {detalle}
                      </Typography>
                    )}
                    <Typography variant="body2" className="tabular" sx={{ mt: 0.5, color: color.inkMuted }}>
                      {formatCurrency(item.precioUnitario)} c/u
                    </Typography>
                    {exceeds && (
                      <Typography variant="body2" role="alert" sx={{ mt: 0.75, color: color.danger.main, fontWeight: 600 }}>
                        {stock > 0 ? `Solo quedan ${stock}. Reduce la cantidad.` : 'Se agotó. Quítalo para continuar.'}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ gridColumn: { xs: '2', sm: 'auto' }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' }, gap: { xs: 1, sm: 3 } }}>
                    <QuantityStepper
                      size="small"
                      value={item.cantidad}
                      max={stock != null ? Math.max(stock, 1) : 99}
                      disabled={busy}
                      label={`Cantidad de ${titulo}`}
                      onChange={(next) => run(item.productoID, () => updateProductQuantity(item.productoID, next), 'No pudimos actualizar la cantidad.')}
                    />
                    <Typography className="tabular" sx={{ fontWeight: 700, minWidth: 84, textAlign: 'right' }}>
                      {formatCurrency(item.precioUnitario * item.cantidad)}
                    </Typography>
                    <Tooltip title="Quitar del carrito">
                      <IconButton
                        aria-label={`Quitar ${titulo} del carrito`}
                        disabled={busy}
                        onClick={() => run(item.productoID, () => removeProductFromCart(item.productoID), 'No pudimos quitar el producto.')}
                        sx={{ width: 44, height: 44, mr: -1, '&:hover': { color: color.danger.main, bgcolor: color.danger.tint } }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })}
          </AnimatePresence>

          <Box component="li" sx={{ pt: 2.5 }}>
            <Button component={Link} to="/productos" variant="text" startIcon={<ArrowBackRoundedIcon />} sx={{ ml: -1 }}>
              Seguir comprando
            </Button>
          </Box>
        </Box>

        <Box
          component={motion.aside}
          aria-label="Resumen del pedido"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: ease.out }}
          sx={{ position: { md: 'sticky' }, top: { md: 'calc(var(--nav-h) + 24px)' }, p: { xs: 3, md: 3.5 }, borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}` }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Resumen
          </Typography>
          <SummaryRow label={itemCount === 1 ? 'Subtotal (1 producto)' : `Subtotal (${itemCount} productos)`} value={formatCurrency(total)} />
          <SummaryRow label="Envío" value="Gratis" />
          <Box sx={{ my: 1.5, borderTop: `1px dashed ${color.lineStrong}` }} />
          <SummaryRow label="Total" value={formatCurrency(total)} strong />
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2.5 }}>
            Precios con IGV incluido.
          </Typography>

          <Button
            onClick={handleComprar}
            disabled={processing || overStock.length > 0}
            fullWidth
            size="large"
            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <WhatsAppIcon />}
            sx={whatsappButtonSx}
          >
            {processing ? 'Registrando pedido…' : 'Pedir por WhatsApp'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }}>
            Registramos tu pedido y abrimos WhatsApp para coordinar el pago y la entrega.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CarritoPage;
