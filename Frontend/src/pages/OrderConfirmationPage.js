import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import pedidoService from '../services/pedidoService';
import { desglosarIgv, totalDeDetalles } from '../lib/orders';
import { formatCurrency, formatDateTime } from '../utils/formatCurrency';
import { splitNombre } from '../lib/productCopy';
import { color, ease, radius } from '../theme/tokens';
import EmptyState from '../components/ui/EmptyState';
import StatusChip from '../components/ui/StatusChip';

/** Check que se dibuja al confirmar el pedido. */
const AnimatedCheck = () => (
  <Box sx={{ width: 84, height: 84, mx: 'auto', borderRadius: '50%', bgcolor: color.olive[100], display: 'grid', placeItems: 'center' }}>
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <motion.path d="M10 23.5 18.5 32 34 14" stroke={color.olive[600]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.25, ease: ease.out }} />
    </svg>
  </Box>
);

const OrderConfirmationPage = () => {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    pedidoService
      .getPedidoById(pedidoId)
      .then((data) => {
        if (cancelled) return;
        setPedido(data);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [pedidoId]);

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos mostrar este pedido"
        description="Es posible que no exista o que pertenezca a otra cuenta."
        action={
          <Button component={Link} to="/mis-compras" variant="contained">
            Ver mis compras
          </Button>
        }
      />
    );
  }

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ pt: 8, textAlign: 'center' }}>
        <Skeleton variant="circular" width={84} height={84} sx={{ mx: 'auto' }} />
        <Skeleton height={56} sx={{ mt: 3 }} />
        <Skeleton variant="rounded" height={260} sx={{ mt: 4, borderRadius: `${radius.lg}px` }} />
      </Container>
    );
  }

  // Los precios ya incluyen IGV; aquí solo se muestra el desglose.
  const { subtotal, igv, total } = desglosarIgv(totalDeDetalles(pedido.detalles));

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 5, md: 8 } }}>
      <Box sx={{ textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}>
          <AnimatedCheck />
        </motion.div>
        <Typography variant="h2" component="h1" sx={{ mt: 3 }}>
          Gracias por tu compra.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.0625rem' }}>
          Tu pedido quedó confirmado. Tu mascota te lo va a agradecer.
        </Typography>
      </Box>

      <Box
        component={motion.section}
        aria-label="Detalle del pedido"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: ease.out }}
        sx={{ mt: 5, borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}`, overflow: 'hidden' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, px: 3, py: 2.25, borderBottom: `1px solid ${color.line}` }}>
          <Box>
            <Typography variant="h5" component="h2" className="tabular">
              Pedido #{pedido.pedidoID}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(pedido.fechaPedido)}
            </Typography>
          </Box>
          <StatusChip status={pedido.estadoPedido} />
        </Box>

        <Box sx={{ px: 3, py: 2.25, borderBottom: `1px solid ${color.line}` }}>
          <Typography variant="caption" color="text.secondary" component="p">
            Enviar a
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>{pedido.nombreCliente}</Typography>
          <Typography color="text.secondary">{pedido.direccionEnvio}</Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, px: 3, py: 2.25, display: 'grid', gap: 1 }}>
          {pedido.detalles.map((item) => (
            <Box key={item.productoID} component="li" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography>
                {splitNombre(item.nombreProducto).titulo}{' '}
                <Box component="span" sx={{ color: color.inkMuted }}>
                  × {item.cantidad}
                </Box>
              </Typography>
              <Typography className="tabular" sx={{ fontWeight: 600 }}>
                {formatCurrency(item.cantidad * item.precioUnitario)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="tabular" sx={{ px: 3, py: 2.25, bgcolor: 'rgba(238, 232, 216, 0.5)', display: 'grid', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: color.inkSoft }}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: color.inkSoft }}>
            <span>IGV (18%)</span>
            <span>{formatCurrency(igv)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 0.5, fontWeight: 700 }}>
            <span>Total pagado</span>
            <Box component="span" sx={{ fontSize: '1.375rem', letterSpacing: '-0.02em' }}>
              {formatCurrency(total)}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
        <Button component={Link} to={`/boleta/${pedido.pedidoID}`} variant="contained" size="large">
          Ver boleta
        </Button>
        <Button component={Link} to="/productos" variant="outlined" size="large">
          Seguir comprando
        </Button>
      </Box>
    </Container>
  );
};

export default OrderConfirmationPage;
