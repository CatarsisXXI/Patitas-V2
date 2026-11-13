import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Collapse, Dialog, IconButton, InputAdornment, MenuItem, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import EditLocationAltOutlinedIcon from '@mui/icons-material/EditLocationAltOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { errorMessage } from '../../config/api';
import { formatCurrency, formatDateTime } from '../../utils/formatCurrency';
import { EDITABLE_STATUSES, ORDER_STATUS } from '../../lib/orders';
import { color } from '../../theme/tokens';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusChip from '../../components/ui/StatusChip';
import Receipt from '../../components/orders/Receipt';
import Panel from '../../components/admin/Panel';
import StatTile, { StatGrid } from '../../components/admin/StatTile';

const COLUMNS = { xs: 'minmax(0, 1fr) auto', md: 'minmax(0, 1.6fr) 164px 110px 168px 132px' };

const OrderRow = ({ order, busy, onStatus, onReceipt, onAddress }) => {
  const [open, setOpen] = useState(false);
  const items = order.detalles || [];
  // Si el pedido tiene un estado que el panel no puede asignar, se muestra igual en el selector.
  const options = EDITABLE_STATUSES.includes(order.estadoPedido) ? EDITABLE_STATUSES : [order.estadoPedido, ...EDITABLE_STATUSES];
  const detailsId = `pedido-${order.pedidoID}-detalle`;

  return (
    <Box component="li" sx={{ borderTop: `1px solid ${color.line}`, opacity: busy ? 0.6 : 1, transition: 'opacity 160ms ease' }}>
      <Box sx={{ display: 'grid', alignItems: 'center', columnGap: 2, rowGap: 1.5, gridTemplateColumns: COLUMNS, px: 3, py: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 600 }}>
            {order.nombreCliente}
          </Typography>
          <Typography variant="caption" color="text.secondary" className="tabular" component="p" noWrap>
            #{order.pedidoID}
            <Box component="span" sx={{ display: { md: 'none' } }}>
              {' '}
              · {formatDateTime(order.fechaPedido)}
            </Box>
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" className="tabular" sx={{ display: { xs: 'none', md: 'block' } }}>
          {formatDateTime(order.fechaPedido)}
        </Typography>

        <Typography className="tabular" sx={{ fontWeight: 650, textAlign: 'right' }}>
          {formatCurrency(order.totalPedido)}
        </Typography>

        <TextField
          select
          size="small"
          value={order.estadoPedido}
          disabled={busy}
          onChange={(event) => onStatus(order, event.target.value)}
          sx={{ gridColumn: { xs: '1 / 2', md: 'auto' }, maxWidth: { xs: 190, md: 'none' } }}
          slotProps={{ select: { renderValue: (value) => <StatusChip status={value} size="small" />, SelectDisplayProps: { 'aria-label': `Estado del pedido ${order.pedidoID}` } } }}
        >
          {options.map((value) => (
            <MenuItem key={value} value={value} disabled={!EDITABLE_STATUSES.includes(value)}>
              <StatusChip status={value} size="small" />
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }}>
          <Tooltip title="Ver boleta">
            <IconButton onClick={() => onReceipt(order)} aria-label={`Ver boleta del pedido ${order.pedidoID}`} sx={{ width: 40, height: 40 }}>
              <ReceiptLongOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {order.estadoPedido === 'Pagado' && (
            <Tooltip title="Editar dirección de envío">
              <IconButton onClick={() => onAddress(order)} aria-label={`Editar dirección del pedido ${order.pedidoID}`} sx={{ width: 40, height: 40 }}>
                <EditLocationAltOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={open ? 'Ocultar productos' : 'Ver productos'}>
            <IconButton onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={detailsId} aria-label={`Productos del pedido ${order.pedidoID}`} sx={{ width: 40, height: 40 }}>
              <ExpandMoreRoundedIcon fontSize="small" sx={{ transition: 'transform 220ms cubic-bezier(0.23, 1, 0.32, 1)', transform: open ? 'rotate(180deg)' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Collapse in={open} id={detailsId} unmountOnExit>
        <Box sx={{ mx: 3, mb: 2.5, p: 2, borderRadius: '14px', bgcolor: 'rgba(238, 232, 216, 0.55)' }}>
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
            Envío a: {order.direccionEnvio || 'Sin dirección registrada'}
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 0.75 }}>
            {items.map((item) => (
              <Box key={item.productoID} component="li" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '0.9375rem' }}>
                <span>
                  {item.nombreProducto}{' '}
                  <Box component="span" className="tabular" sx={{ color: color.inkMuted }}>
                    × {item.cantidad}
                  </Box>
                </span>
                <Box component="span" className="tabular" sx={{ fontWeight: 600, flexShrink: 0 }}>
                  {formatCurrency(item.cantidad * item.precioUnitario)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

const OrderManagementPage = () => {
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const [pendingPay, setPendingPay] = useState({ open: false, order: null });
  const [address, setAddress] = useState({ open: false, order: null, value: '' });
  const [savingAddress, setSavingAddress] = useState(false);
  const [receipt, setReceipt] = useState({ open: false, order: null });
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef(null);

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

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.estadoPedido !== statusFilter) return false;
      if (!term) return true;
      return String(order.pedidoID).includes(term) || (order.nombreCliente || '').toLowerCase().includes(term) || (order.direccionEnvio || '').toLowerCase().includes(term);
    });
  }, [orders, searchTerm, statusFilter]);

  const count = (estado) => orders.filter((order) => order.estadoPedido === estado).length;

  const applyStatus = async (order, nextStatus) => {
    setBusyId(order.pedidoID);
    try {
      await adminService.updateOrderStatus(order.pedidoID, nextStatus);
      setOrders((prev) => prev.map((item) => (item.pedidoID === order.pedidoID ? { ...item, estadoPedido: nextStatus } : item)));
      notify(`Pedido #${order.pedidoID} marcado como ${ORDER_STATUS[nextStatus]?.label.toLowerCase() || nextStatus}.`);
    } catch (error) {
      notify(errorMessage(error, 'No pudimos actualizar el estado.'), { severity: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  // Marcar como pagado descuenta stock en el backend, por eso pide confirmación.
  const handleStatus = (order, nextStatus) => {
    if (nextStatus === order.estadoPedido) return;
    if (nextStatus === 'Pagado') setPendingPay({ open: true, order });
    else applyStatus(order, nextStatus);
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    const value = address.value.trim();
    if (!value) return;
    setSavingAddress(true);
    try {
      await adminService.updateOrderAddress(address.order.pedidoID, value);
      setOrders((prev) => prev.map((item) => (item.pedidoID === address.order.pedidoID ? { ...item, direccionEnvio: value } : item)));
      notify('Dirección actualizada.');
      setAddress((prev) => ({ ...prev, open: false }));
    } catch (error) {
      notify(errorMessage(error, 'No pudimos actualizar la dirección.'), { severity: 'error' });
    } finally {
      setSavingAddress(false);
    }
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      // Las librerías de PDF pesan; se descargan solo cuando se usan.
      const [{ default: html2canvas }, { default: JsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const pdf = new JsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      const image = canvas.toDataURL('image/png');
      let offset = 0;
      pdf.addImage(image, 'PNG', 0, offset, pageWidth, imageHeight);
      while (imageHeight + offset > pageHeight) {
        offset -= pageHeight;
        pdf.addPage();
        pdf.addImage(image, 'PNG', 0, offset, pageWidth, imageHeight);
      }
      pdf.save(`boleta_pedido_${receipt.order.pedidoID}.pdf`);
      notify('Boleta descargada.');
    } catch {
      notify('No pudimos generar el PDF.', { severity: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar los pedidos"
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
  const hasFilters = searchTerm || statusFilter !== 'all';

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Confirma pagos, corrige direcciones y descarga boletas."
        actions={
          <Button onClick={load} variant="outlined" startIcon={<RefreshRoundedIcon />} disabled={loading}>
            Actualizar
          </Button>
        }
      />

      <StatGrid>
        <StatTile label="Pedidos" value={orders.length} loading={loading} />
        <StatTile label="Pendientes" value={count('Pendiente')} hint="Esperan confirmación de pago" loading={loading} />
        <StatTile label="Pagados" value={count('Pagado')} loading={loading} />
        <StatTile label="Cancelados" value={count('Cancelado')} loading={loading} />
      </StatGrid>

      <Panel padded={false}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 220px' }, p: 2.5 }}>
          <TextField
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por cliente, número o dirección"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Buscar pedidos', type: 'search' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField select size="small" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} slotProps={{ select: { SelectDisplayProps: { 'aria-label': 'Filtrar por estado' } } }}>
            <MenuItem value="all">Todos los estados</MenuItem>
            {EDITABLE_STATUSES.map((value) => (
              <MenuItem key={value} value={value}>
                {ORDER_STATUS[value].label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: COLUMNS.md, columnGap: 2, px: 3, py: 1.25, borderTop: `1px solid ${color.line}`, fontSize: '0.8125rem', fontWeight: 650, color: color.inkMuted }}>
          <span>Cliente</span>
          <span>Fecha</span>
          <Box component="span" sx={{ textAlign: 'right' }}>
            Total
          </Box>
          <span>Estado</span>
          <span />
        </Box>

        {loading ? (
          <Box sx={{ px: 3, pb: 2 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={64} />
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState compact icon={<ReceiptLongOutlinedIcon />} title={hasFilters ? 'Sin resultados' : 'Aún no hay pedidos'} description={hasFilters ? 'Ningún pedido coincide con la búsqueda o el filtro.' : 'Los pedidos de la tienda aparecerán aquí.'} />
        ) : (
          <Box component="ul" aria-label="Pedidos" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {filtered.map((order) => (
              <OrderRow
                key={order.pedidoID}
                order={order}
                busy={busyId === order.pedidoID}
                onStatus={handleStatus}
                onReceipt={(item) => setReceipt({ open: true, order: item })}
                onAddress={(item) => setAddress({ open: true, order: item, value: item.direccionEnvio || '' })}
              />
            ))}
          </Box>
        )}
      </Panel>

      <ConfirmDialog
        open={pendingPay.open}
        tone="primary"
        title={`¿Marcar el pedido #${pendingPay.order?.pedidoID} como pagado?`}
        description="Se descontará del stock la cantidad de cada producto del pedido."
        confirmLabel="Marcar como pagado"
        onConfirm={() => {
          setPendingPay((prev) => ({ ...prev, open: false }));
          applyStatus(pendingPay.order, 'Pagado');
        }}
        onClose={() => setPendingPay((prev) => ({ ...prev, open: false }))}
      />

      <Dialog open={address.open} onClose={savingAddress ? undefined : () => setAddress((prev) => ({ ...prev, open: false }))} maxWidth="sm" fullWidth aria-labelledby="direccion-titulo">
        <Box component="form" onSubmit={saveAddress} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography id="direccion-titulo" variant="h2" sx={{ mb: 0.5 }}>
            Dirección de envío
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            Pedido #{address.order?.pedidoID} de {address.order?.nombreCliente}
          </Typography>
          <TextField value={address.value} onChange={(event) => setAddress((prev) => ({ ...prev, value: event.target.value }))} label="Nueva dirección" fullWidth multiline minRows={2} autoFocus required />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button onClick={() => setAddress((prev) => ({ ...prev, open: false }))} disabled={savingAddress} variant="text">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={savingAddress || !address.value.trim()} startIcon={savingAddress ? <CircularProgress size={16} color="inherit" /> : null}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={receipt.open} onClose={() => setReceipt((prev) => ({ ...prev, open: false }))} maxWidth="md" fullWidth aria-label="Boleta de venta">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 3, py: 1.5, borderBottom: `1px solid ${color.line}` }}>
          <Typography variant="h4" component="h2">
            Boleta del pedido #{receipt.order?.pedidoID}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button onClick={downloadReceipt} disabled={downloading} variant="contained" size="small" startIcon={downloading ? <CircularProgress size={14} color="inherit" /> : <DownloadRoundedIcon />}>
              {downloading ? 'Generando…' : 'Descargar PDF'}
            </Button>
            <IconButton onClick={() => setReceipt((prev) => ({ ...prev, open: false }))} aria-label="Cerrar" sx={{ width: 40, height: 40 }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ overflowY: 'auto' }}>{receipt.order && <Receipt ref={receiptRef} pedido={receipt.order} />}</Box>
      </Dialog>
    </>
  );
};

export default OrderManagementPage;
