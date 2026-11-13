import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { site } from '../../config/site';
import { desglosarIgv, receiptNumber, totalDeDetalles } from '../../lib/orders';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { color, font } from '../../theme/tokens';

const Meta = ({ label, children }) => (
  <Box>
    <Typography component="dt" variant="caption" sx={{ color: color.inkMuted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {label}
    </Typography>
    <Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>
      {children}
    </Typography>
  </Box>
);

/**
 * Boleta de venta. Se usa en pantalla, al imprimir y al exportar a PDF,
 * por eso sus colores son fijos (fondo blanco) y no dependen del tema.
 */
const Receipt = forwardRef(function Receipt({ pedido }, ref) {
  const detalles = pedido.detalles || [];
  const { subtotal, igv, total } = desglosarIgv(totalDeDetalles(detalles));

  return (
    <Box ref={ref} sx={{ bgcolor: color.white, color: color.ink, p: { xs: 3, sm: 6 }, '@media print': { p: 0 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 3, pb: 3, borderBottom: `2px solid ${color.ink}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box component="img" src="/images/logo.webp" alt="" sx={{ width: 64, height: 64, objectFit: 'contain' }} />
          <Box>
            <Typography sx={{ fontFamily: font.display, fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{site.name}</Typography>
            <Typography variant="body2" sx={{ color: color.inkSoft }}>
              {site.legal.address}
            </Typography>
            <Typography variant="body2" sx={{ color: color.inkSoft }}>
              Tel. {site.legal.phone}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px: 2.5, py: 1.5, border: `1.5px solid ${color.ink}`, borderRadius: '10px', textAlign: 'center', alignSelf: 'flex-start' }}>
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
            RUC {site.legal.ruc}
          </Typography>
          <Typography sx={{ fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.8125rem' }}>BOLETA DE VENTA</Typography>
          <Typography className="tabular" sx={{ fontWeight: 700 }}>
            {receiptNumber(site.legal.receiptSeries, pedido.pedidoID)}
          </Typography>
        </Box>
      </Box>

      <Box component="dl" sx={{ m: 0, py: 3, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
        <Meta label="Cliente">{pedido.nombreCliente || 'Cliente'}</Meta>
        <Meta label="Fecha de emisión">{formatDate(pedido.fechaPedido)}</Meta>
        <Meta label="Dirección de envío">{pedido.direccionEnvio || 'Por coordinar'}</Meta>
      </Box>

      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem', '& th, & td': { py: 1.25, px: 0.5, textAlign: 'right', borderBottom: `1px solid ${color.line}` }, '& th:first-of-type, & td:first-of-type': { textAlign: 'left', pl: 0 }, '& th': { fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.inkMuted, fontWeight: 650, borderBottom: `1px solid ${color.lineStrong}` } }}>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Cant.</th>
            <th scope="col">P. unit.</th>
            <th scope="col">Importe</th>
          </tr>
        </thead>
        <tbody className="tabular">
          {detalles.map((item) => (
            <tr key={item.productoID}>
              <td>{item.nombreProducto}</td>
              <td>{item.cantidad}</td>
              <td>{formatCurrency(item.precioUnitario)}</td>
              <td>{formatCurrency(item.cantidad * item.precioUnitario)}</td>
            </tr>
          ))}
        </tbody>
      </Box>

      <Box className="tabular" sx={{ mt: 3, ml: 'auto', width: { xs: '100%', sm: 280 }, display: 'grid', gap: 0.75 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: color.inkSoft }}>
          <span>Op. gravada</span>
          <span>{formatCurrency(subtotal)}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: color.inkSoft }}>
          <span>IGV (18%)</span>
          <span>{formatCurrency(igv)}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 1.25, mt: 0.5, borderTop: `2px solid ${color.ink}`, fontWeight: 700 }}>
          <span>Total</span>
          <Box component="span" sx={{ fontSize: '1.375rem', letterSpacing: '-0.02em' }}>
            {formatCurrency(total)}
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mt: 5, textAlign: 'center', color: color.inkSoft }}>
        Gracias por tu compra en {site.name}.
      </Typography>
    </Box>
  );
});

export default Receipt;
