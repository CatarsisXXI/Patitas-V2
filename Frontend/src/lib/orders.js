import { color } from '../theme/tokens';

export const IGV = 0.18;

/** Los precios ya incluyen IGV: separa base imponible e impuesto a partir del total. */
export const desglosarIgv = (total) => {
  const safe = Number(total) || 0;
  const subtotal = safe / (1 + IGV);
  return { subtotal, igv: safe - subtotal, total: safe };
};

export const totalDeDetalles = (detalles = []) =>
  detalles.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);

export const ORDER_STATUS = {
  Pendiente: { label: 'Pendiente', fg: color.warning.main, bg: color.warning.tint },
  Pagado: { label: 'Pagado', fg: color.success.main, bg: color.success.tint },
  Enviado: { label: 'Enviado', fg: color.info.main, bg: color.info.tint },
  Entregado: { label: 'Entregado', fg: color.olive[700], bg: color.olive[100] },
  Cancelado: { label: 'Cancelado', fg: color.danger.main, bg: color.danger.tint },
};

// Estados que el backend acepta al actualizar un pedido desde el panel.
export const EDITABLE_STATUSES = ['Pendiente', 'Pagado', 'Cancelado'];

export const hasReceipt = (estado) => ['Pagado', 'Enviado', 'Entregado'].includes(estado);

export const receiptNumber = (series, pedidoID) => `${series}-${String(pedidoID).padStart(6, '0')}`;
