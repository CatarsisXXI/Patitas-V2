import React from 'react';
import { Box, Typography } from '@mui/material';
import { API_ORIGIN } from '../../config/api';
import { site } from '../../config/site';
import { color, radius } from '../../theme/tokens';
import PageHeader from '../../components/ui/PageHeader';
import Panel from '../../components/admin/Panel';

const Item = ({ label, children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, gap: { xs: 0.25, sm: 2 }, py: 1.5, borderTop: `1px solid ${color.line}`, '&:first-of-type': { borderTop: 0 } }}>
    <Typography component="dt" color="text.secondary">
      {label}
    </Typography>
    <Typography component="dd" sx={{ m: 0, fontWeight: 600, overflowWrap: 'anywhere' }}>
      {children}
    </Typography>
  </Box>
);

const Code = ({ children }) => (
  <Box component="code" sx={{ px: 0.75, py: 0.25, borderRadius: `${radius.xs}px`, bgcolor: color.sunken, fontSize: '0.875em' }}>
    {children}
  </Box>
);

const PENDING = [
  ['Medios de pago', 'Cobro en línea con pasarela, además del pedido por WhatsApp.'],
  ['Envíos', 'Costos por distrito y seguimiento de entregas.'],
  ['Notificaciones', 'Avisos al cliente cuando cambia el estado de su pedido.'],
];

/** Muestra la configuración vigente. Hoy se edita en el código; no hay formulario todavía. */
const SettingsPage = () => (
  <>
    <PageHeader title="Configuración" description="Datos con los que funciona la tienda. Por ahora se cambian en el código y requieren volver a publicar." />

    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' }, alignItems: 'start' }}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Panel title="Datos de la tienda" description={<>Se editan en <Code>src/config/site.js</Code>.</>}>
          <Box component="dl" sx={{ m: 0 }}>
            <Item label="Nombre">{site.name}</Item>
            <Item label="WhatsApp de pedidos">+{site.whatsapp}</Item>
            {site.social.map((item) => (
              <Item key={item.name} label={item.name}>
                {item.url.replace(/^https?:\/\//, '')}
              </Item>
            ))}
          </Box>
        </Panel>

        <Panel title="Datos de la boleta" description="Aparecen en el encabezado de cada comprobante. Verifica que sean los reales antes de publicar.">
          <Box component="dl" sx={{ m: 0 }}>
            <Item label="RUC">{site.legal.ruc}</Item>
            <Item label="Dirección fiscal">{site.legal.address}</Item>
            <Item label="Teléfono">{site.legal.phone}</Item>
            <Item label="Serie">{site.legal.receiptSeries}</Item>
          </Box>
        </Panel>

        <Panel title="Conexión con el backend" description={<>Se define con la variable <Code>REACT_APP_API_URL</Code> al compilar.</>}>
          <Box component="dl" sx={{ m: 0 }}>
            <Item label="URL de la API">{API_ORIGIN}</Item>
          </Box>
        </Panel>
      </Box>

      <Panel title="Aún no disponible" description="Funciones que este panel todavía no incluye.">
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {PENDING.map(([title, text]) => (
            <Box key={title} component="li" sx={{ py: 1.5, borderTop: `1px solid ${color.line}`, '&:first-of-type': { borderTop: 0 } }}>
              <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Panel>
    </Box>
  </>
);

export default SettingsPage;
