import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUS } from '../../lib/orders';
import { pedidosPorEstado, productosMasVendidos, resumen, ventasPorSemana } from '../../lib/reports';
import { splitNombre } from '../../lib/productCopy';
import { chart, color } from '../../theme/tokens';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Panel from '../../components/admin/Panel';
import StatTile, { StatGrid } from '../../components/admin/StatTile';
import { BarList, ColumnChart, SegmentedBar } from '../../components/admin/charts';

const WEEKS = 8;
const shortDate = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' });
const weekLabel = (date) => shortDate.format(date).replace('.', '');
const compactMoney = (value) => `S/ ${Math.round(value).toLocaleString('es-PE')}`;
const percent = (value) => `${(value * 100).toFixed(1).replace('.0', '')}%`;

const ViewToggle = ({ table, onChange }) => (
  <Button size="small" variant="text" onClick={() => onChange(!table)} aria-pressed={table}>
    {table ? 'Ver gráfico' : 'Ver tabla'}
  </Button>
);

const NoData = ({ children }) => (
  <Typography color="text.secondary" sx={{ py: 4 }}>
    {children}
  </Typography>
);

const ReportsPage = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [weeksAsTable, setWeeksAsTable] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setOrders(await adminService.getPedidos());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(() => resumen(orders), [orders]);
  const weeks = useMemo(() => ventasPorSemana(orders, WEEKS), [orders]);
  const top = useMemo(() => productosMasVendidos(orders, 5), [orders]);
  const byStatus = useMemo(() => pedidosPorEstado(orders), [orders]);

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar los reportes"
        description="Comprueba que el backend esté en marcha y vuelve a intentarlo."
        action={
          <Button onClick={load} variant="contained" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const loading = status === 'loading';

  if (!loading && orders.length === 0) {
    return (
      <>
        <PageHeader title="Reportes" description="Ventas y pedidos de la tienda." />
        <EmptyState compact icon={<InsightsOutlinedIcon />} title="Aún no hay datos" description="Los reportes se calculan con los pedidos. Aparecerán cuando llegue el primero." />
      </>
    );
  }

  const weekData = weeks.map((week) => ({
    key: week.inicio.toISOString(),
    label: weekLabel(week.inicio),
    value: week.total,
    tooltip: `Semana del ${weekLabel(week.inicio)} · ${week.pedidos} ${week.pedidos === 1 ? 'pedido' : 'pedidos'}`,
  }));
  const weeksHaveSales = weeks.some((week) => week.total > 0);

  return (
    <>
      <PageHeader
        title="Reportes"
        description="Calculados con todos los pedidos registrados. Las ventas cuentan solo los pedidos pagados."
        actions={
          <Button onClick={load} variant="outlined" startIcon={<RefreshRoundedIcon />} disabled={loading}>
            Actualizar
          </Button>
        }
      />

      <StatGrid>
        <StatTile label="Ventas" value={formatCurrency(totals.ingresos)} hint={`${totals.pedidosPagados} ${totals.pedidosPagados === 1 ? 'pedido pagado' : 'pedidos pagados'}`} loading={loading} />
        <StatTile label="Ticket promedio" value={formatCurrency(totals.ticketPromedio)} hint="Por pedido pagado" loading={loading} />
        <StatTile label="Por cobrar" value={formatCurrency(totals.porCobrar)} hint={`${totals.pedidosPendientes} ${totals.pedidosPendientes === 1 ? 'pedido pendiente' : 'pedidos pendientes'}`} loading={loading} />
        <StatTile label="Cancelación" value={percent(totals.tasaCancelacion)} hint={`De ${totals.totalPedidos} pedidos`} loading={loading} />
      </StatGrid>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, alignItems: 'start' }}>
        <Panel title="Ventas por semana" description={`Pedidos pagados en las últimas ${WEEKS} semanas, por semana de inicio (lunes).`} action={!loading && <ViewToggle table={weeksAsTable} onChange={setWeeksAsTable} />}>
          {loading ? (
            <Skeleton variant="rounded" height={250} />
          ) : weeksAsTable ? (
            <Table size="small" aria-label="Ventas por semana">
              <TableHead>
                <TableRow>
                  <TableCell>Semana del</TableCell>
                  <TableCell align="right">Pedidos</TableCell>
                  <TableCell align="right">Ventas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tabular">
                {weeks.map((week) => (
                  <TableRow key={week.inicio.toISOString()}>
                    <TableCell>{weekLabel(week.inicio)}</TableCell>
                    <TableCell align="right">{week.pedidos}</TableCell>
                    <TableCell align="right">{formatCurrency(week.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : weeksHaveSales ? (
            <Box sx={{ pt: 2 }}>
              <ColumnChart data={weekData} format={compactMoney} ariaLabel={`Ventas por semana de las últimas ${WEEKS} semanas`} />
            </Box>
          ) : (
            <NoData>No hay pedidos pagados en las últimas {WEEKS} semanas.</NoData>
          )}
        </Panel>

        <Box sx={{ display: 'grid', gap: 3 }}>
          <Panel title="Pedidos por estado">
            {loading ? (
              <Skeleton variant="rounded" height={120} />
            ) : (
              <>
                <Box sx={{ pt: 1 }}>
                  <SegmentedBar unit="pedidos" data={byStatus.map((item) => ({ key: item.estado, label: ORDER_STATUS[item.estado]?.label || item.estado, value: item.cantidad, fill: chart.status[item.estado] || color.inkMuted }))} />
                </Box>
                <Table size="small" aria-label="Pedidos por estado" sx={{ mt: 2, '& td, & th': { px: 0 } }}>
                  <TableBody className="tabular">
                    {byStatus.map((item) => (
                      <TableRow key={item.estado} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                        <TableCell>{ORDER_STATUS[item.estado]?.label || item.estado}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {item.cantidad}
                        </TableCell>
                        <TableCell align="right" sx={{ color: color.inkMuted, width: 72 }}>
                          {percent(item.cantidad / orders.length)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Panel>

          <Panel title="Más vendidos" description="Unidades en pedidos pagados.">
            {loading ? (
              <Skeleton variant="rounded" height={160} />
            ) : top.length === 0 ? (
              <NoData>Todavía no hay ventas pagadas.</NoData>
            ) : (
              <Box sx={{ pt: 1 }}>
                <BarList data={top.map((item) => ({ key: item.productoID, label: splitNombre(item.nombre).titulo, value: item.unidades, sublabel: formatCurrency(item.ingresos) }))} format={(value) => `${value} u.`} />
              </Box>
            )}
          </Panel>
        </Box>
      </Box>
    </>
  );
};

export default ReportsPage;
