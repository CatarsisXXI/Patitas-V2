import React from 'react';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useOrders } from '../components/orders/useOrders';
import { hasReceipt } from '../lib/orders';
import { whatsappUrl } from '../config/site';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { splitNombre } from '../lib/productCopy';
import { color, radius, whatsappButtonSx } from '../theme/tokens';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import StatusChip from '../components/ui/StatusChip';
import { Stagger, StaggerItem } from '../components/ui/motion';

const OrderCard = ({ pedido }) => (
  <Box component="article" sx={{ borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}`, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, px: { xs: 2.5, sm: 3.5 }, py: 2.25, borderBottom: `1px solid ${color.line}` }}>
      <Box>
        <Typography variant="h5" component="h2" className="tabular">
          Pedido #{pedido.pedidoID}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(pedido.fechaPedido)}
        </Typography>
      </Box>
      <StatusChip status={pedido.estadoPedido} />
    </Box>

    <Box component="ul" sx={{ listStyle: 'none', m: 0, px: { xs: 2.5, sm: 3.5 }, py: 2, display: 'grid', gap: 1 }}>
      {pedido.detalles.map((detalle) => (
        <Box key={detalle.productoID} component="li" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography>
            {splitNombre(detalle.nombreProducto).titulo}{' '}
            <Box component="span" sx={{ color: color.inkMuted }}>
              × {detalle.cantidad}
            </Box>
          </Typography>
          <Typography className="tabular" sx={{ fontWeight: 600 }}>
            {formatCurrency(detalle.precioUnitario * detalle.cantidad)}
          </Typography>
        </Box>
      ))}
    </Box>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: { xs: 2.5, sm: 3.5 }, py: 2.25, bgcolor: 'rgba(238, 232, 216, 0.5)' }}>
      <Box>
        <Typography variant="caption" color="text.secondary" component="p">
          {pedido.direccionEnvio ? `Envío a ${pedido.direccionEnvio}` : 'Dirección por coordinar'}
        </Typography>
        <Typography className="tabular" sx={{ fontWeight: 700, fontSize: '1.1875rem' }}>
          Total {formatCurrency(pedido.totalPedido)}
        </Typography>
      </Box>
      {hasReceipt(pedido.estadoPedido) ? (
        <Button component={Link} to={`/boleta/${pedido.pedidoID}`} variant="outlined" startIcon={<ReceiptLongOutlinedIcon />}>
          Ver boleta
        </Button>
      ) : pedido.estadoPedido === 'Pendiente' ? (
        <Button
          component="a"
          href={whatsappUrl(`Hola, quiero confirmar mi pedido #${pedido.pedidoID}.`)}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<WhatsAppIcon />}
          sx={whatsappButtonSx}
        >
          Confirmar por WhatsApp
        </Button>
      ) : null}
    </Box>
  </Box>
);

const MisComprasPage = () => {
  const { pedidos, status, reload } = useOrders();

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar tus compras"
        description="Revisa tu conexión e inténtalo otra vez."
        action={
          <Button onClick={reload} variant="contained" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  if (status === 'ready' && pedidos.length === 0) {
    return (
      <EmptyState
        icon={<LocalMallOutlinedIcon />}
        title="Aún no tienes compras"
        description="Cuando hagas tu primer pedido, podrás seguirlo desde aquí."
        action={
          <Button component={Link} to="/productos" variant="contained" size="large">
            Ver catálogo
          </Button>
        }
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 } }}>
      <PageHeader crumbs={[{ label: 'Inicio', to: '/' }]} current="Mis compras" eyebrow="Tu cuenta" title="Mis compras" description="El estado de cada pedido, del más reciente al más antiguo." />

      {status === 'loading' ? (
        <Box sx={{ display: 'grid', gap: 3 }}>
          {[0, 1].map((i) => (
            <Skeleton key={i} variant="rounded" height={220} sx={{ borderRadius: `${radius.lg}px` }} />
          ))}
        </Box>
      ) : (
        <Stagger inView={false} style={{ display: 'grid', gap: 24 }}>
          {pedidos.map((pedido) => (
            <StaggerItem key={pedido.pedidoID}>
              <OrderCard pedido={pedido} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Container>
  );
};

export default MisComprasPage;
