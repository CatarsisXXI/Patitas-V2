import React, { useEffect, useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import productService from '../../services/productService';
import { formatCurrency, formatShortDate } from '../../utils/formatCurrency';
import { LOW_STOCK, splitNombre } from '../../lib/productCopy';
import { color } from '../../theme/tokens';
import PageHeader from '../../components/ui/PageHeader';
import StatusChip from '../../components/ui/StatusChip';
import Panel from '../../components/admin/Panel';
import StatTile, { StatGrid } from '../../components/admin/StatTile';

const Row = ({ children }) => (
  <Box component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.5, borderTop: `1px solid ${color.line}`, '&:first-of-type': { borderTop: 0 } }}>
    {children}
  </Box>
);

const Empty = ({ children }) => (
  <Typography color="text.secondary" sx={{ py: 3 }}>
    {children}
  </Typography>
);

const ListSkeleton = () => (
  <Box sx={{ display: 'grid', gap: 1.5, py: 1 }}>
    {[0, 1, 2, 3].map((i) => (
      <Skeleton key={i} height={36} />
    ))}
  </Box>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Cada bloque carga por separado: si uno falla, el resto del resumen sigue visible.
    adminService.getDashboardStats().then((data) => !cancelled && setStats(data)).catch(() => !cancelled && setStats({}));
    adminService.getPedidos().then((data) => !cancelled && setOrders(data)).catch(() => !cancelled && setOrders([]));
    productService.getAdminProductos().then((data) => !cancelled && setProducts(data)).catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = stats === null;
  const pending = (orders || []).filter((order) => order.estadoPedido === 'Pendiente').length;
  const recent = (orders || []).slice(0, 5);
  const lowStock = (products || []).filter((product) => product.activo && product.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock).slice(0, 5);
  const number = (value) => (value ?? 0).toLocaleString('es-PE');

  return (
    <>
      <PageHeader
        eyebrow="Panel de administración"
        title={`Hola, ${user?.firstName || 'equipo'}`}
        description={orders === null ? 'Cargando el estado de la tienda.' : pending > 0 ? `Tienes ${pending} ${pending === 1 ? 'pedido pendiente' : 'pedidos pendientes'} de confirmar.` : 'No hay pedidos pendientes por ahora.'}
        actions={
          <Button component={Link} to="/admin/pedidos" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>
            Gestionar pedidos
          </Button>
        }
      />

      <StatGrid>
        <StatTile label="Ventas pagadas" value={formatCurrency(stats?.ventasTotales ?? 0)} hint="Suma de pedidos en estado Pagado" icon={<PaymentsOutlinedIcon />} loading={loading} />
        <StatTile label="Pedidos" value={number(stats?.totalPedidos)} hint="Todos los estados" icon={<ReceiptLongOutlinedIcon />} loading={loading} />
        <StatTile label="Productos activos" value={number(stats?.totalProductos)} hint="Visibles en el catálogo" icon={<Inventory2OutlinedIcon />} loading={loading} />
        <StatTile label="Clientes" value={number(stats?.totalUsuarios)} hint="Cuentas registradas" icon={<GroupOutlinedIcon />} loading={loading} />
      </StatGrid>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, alignItems: 'start' }}>
        <Panel
          title="Pedidos recientes"
          action={
            <Button component={Link} to="/admin/pedidos" size="small" variant="text">
              Ver todos
            </Button>
          }
        >
          {orders === null ? (
            <ListSkeleton />
          ) : recent.length === 0 ? (
            <Empty>Todavía no hay pedidos.</Empty>
          ) : (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {recent.map((order) => (
                <Row key={order.pedidoID}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                      {order.nombreCliente}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="tabular">
                      #{order.pedidoID} · {formatShortDate(order.fechaPedido)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                    <StatusChip status={order.estadoPedido} size="small" />
                    <Typography className="tabular" sx={{ fontWeight: 650, minWidth: 76, textAlign: 'right' }}>
                      {formatCurrency(order.totalPedido)}
                    </Typography>
                  </Box>
                </Row>
              ))}
            </Box>
          )}
        </Panel>

        <Panel
          title="Stock bajo"
          action={
            <Button component={Link} to="/admin/productos" size="small" variant="text">
              Ver productos
            </Button>
          }
        >
          {products === null ? (
            <ListSkeleton />
          ) : lowStock.length === 0 ? (
            <Empty>Todos los productos activos tienen más de {LOW_STOCK} unidades.</Empty>
          ) : (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {lowStock.map((product) => (
                <Row key={product.productoID}>
                  <Typography noWrap sx={{ fontWeight: 600, minWidth: 0 }}>
                    {splitNombre(product.nombre).titulo}
                  </Typography>
                  <StatusChip size="small" tone={product.stock === 0 ? 'danger' : 'warning'} label={product.stock === 0 ? 'Agotado' : `${product.stock} ${product.stock === 1 ? 'unidad' : 'unidades'}`} />
                </Row>
              ))}
            </Box>
          )}
        </Panel>
      </Box>
    </>
  );
};

export default AdminDashboard;
