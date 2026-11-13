import React from 'react';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useOrders } from '../components/orders/useOrders';
import { hasReceipt, receiptNumber } from '../lib/orders';
import { site } from '../config/site';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { color, ease, radius, shadow } from '../theme/tokens';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import StatusChip from '../components/ui/StatusChip';
import { Stagger, StaggerItem } from '../components/ui/motion';

const MisBoletasPage = () => {
  const { pedidos, status, reload } = useOrders();
  // Solo los pedidos pagados (o posteriores) generan boleta.
  const boletas = pedidos.filter((pedido) => hasReceipt(pedido.estadoPedido));

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar tus boletas"
        description="Revisa tu conexión e inténtalo otra vez."
        action={
          <Button onClick={reload} variant="contained" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  if (status === 'ready' && boletas.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptLongOutlinedIcon />}
        title="Aún no tienes boletas"
        description="La boleta se genera cuando confirmamos el pago de tu pedido."
        action={
          <Button component={Link} to="/mis-compras" variant="contained">
            Ver mis compras
          </Button>
        }
        secondaryAction={
          <Button component={Link} to="/productos" variant="outlined">
            Ver catálogo
          </Button>
        }
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <PageHeader crumbs={[{ label: 'Inicio', to: '/' }]} current="Mis boletas" eyebrow="Tu cuenta" title="Mis boletas" description="Comprobantes de tus pedidos pagados. Puedes abrirlos e imprimirlos." />

      {status === 'loading' ? (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={170} sx={{ borderRadius: `${radius.lg}px` }} />
          ))}
        </Box>
      ) : (
        <Stagger inView={false} style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}>
          {boletas.map((pedido) => (
            <StaggerItem key={pedido.pedidoID} style={{ height: '100%' }}>
              <Box
                component={Link}
                to={`/boleta/${pedido.pedidoID}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  borderRadius: `${radius.lg}px`,
                  bgcolor: color.surface,
                  border: `1px solid ${color.line}`,
                  color: 'text.primary',
                  transition: `transform 300ms ${ease.css.out}, box-shadow 300ms ${ease.css.out}`,
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: shadow.md },
                  '&:hover .flecha': { transform: 'translateX(4px)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Boleta de venta
                    </Typography>
                    <Typography variant="h5" component="h2" className="tabular">
                      {receiptNumber(site.legal.receiptSeries, pedido.pedidoID)}
                    </Typography>
                  </Box>
                  <StatusChip status={pedido.estadoPedido} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {formatDate(pedido.fechaPedido)}
                </Typography>
                <Box sx={{ mt: 'auto', pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography className="tabular" sx={{ fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.02em' }}>
                    {formatCurrency(pedido.totalPedido)}
                  </Typography>
                  <Box className="flecha" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: color.olive[700], fontWeight: 650, fontSize: '0.9063rem', transition: `transform 240ms ${ease.css.out}` }}>
                    Abrir <ArrowForwardRoundedIcon fontSize="small" />
                  </Box>
                </Box>
              </Box>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Container>
  );
};

export default MisBoletasPage;
