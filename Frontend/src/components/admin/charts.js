import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { chart, color } from '../../theme/tokens';

// Gráficos del panel. Reglas: una sola serie por gráfico, barras finas con
// extremo redondeado, cuadrícula discreta, texto siempre en tinta (nunca en el
// color de la serie) y el mismo detalle al pasar el cursor que con el teclado.

const niceMax = (value) => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value);
  return step * magnitude;
};

const TipContent = ({ value, label }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{value}</Box>
    <Box sx={{ opacity: 0.8 }}>{label}</Box>
  </Box>
);

/**
 * Columnas para una serie en el tiempo.
 * data: [{ key, label, value, tooltip }]
 */
export const ColumnChart = ({ data, format = (v) => v, height = 220, ariaLabel }) => {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const ticks = [1, 0.5, 0];
  const peak = data.reduce((best, d) => (d.value > best.value ? d : best), data[0]);

  return (
    <Box role="img" aria-label={ariaLabel} sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 1.5 }}>
      <Box className="tabular" sx={{ position: 'relative', height, width: 'max-content', minWidth: 28, fontSize: '0.75rem', color: color.inkMuted }}>
        {ticks.map((t) => (
          <Box key={t} sx={{ position: 'absolute', right: 0, top: `${(1 - t) * 100}%`, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>
            {format(max * t)}
          </Box>
        ))}
        <Box sx={{ visibility: 'hidden', whiteSpace: 'nowrap' }}>{format(max)}</Box>
      </Box>

      <Box sx={{ position: 'relative', height }}>
        {ticks.map((t) => (
          <Box key={t} sx={{ position: 'absolute', left: 0, right: 0, top: `${(1 - t) * 100}%`, borderTop: `1px solid ${t === 0 ? color.lineStrong : chart.grid}` }} />
        ))}
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, alignItems: 'end' }}>
          {data.map((d) => {
            const ratio = max ? d.value / max : 0;
            return (
              <Tooltip key={d.key} title={<TipContent value={format(d.value)} label={d.tooltip || d.label} />} placement="top">
                <Box
                  tabIndex={0}
                  aria-label={`${d.tooltip || d.label}: ${format(d.value)}`}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', cursor: 'default', outlineOffset: -2, '&:hover .col, &:focus-visible .col': { bgcolor: color.olive[700] } }}
                >
                  {d.key === peak.key && d.value > 0 && (
                    <Box className="tabular" sx={{ mb: 0.5, fontSize: '0.75rem', fontWeight: 650, color: color.ink, whiteSpace: 'nowrap' }}>
                      {format(d.value)}
                    </Box>
                  )}
                  <Box className="col" sx={{ width: '100%', maxWidth: 24, height: `${Math.max(ratio * 100, d.value > 0 ? 1.5 : 0)}%`, borderRadius: '4px 4px 0 0', bgcolor: chart.series, transition: 'background-color 140ms ease' }} />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      <Box />
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, mt: 1 }}>
        {data.map((d, index) => (
          <Box key={d.key} sx={{ textAlign: 'center', fontSize: '0.75rem', color: color.inkMuted, whiteSpace: 'nowrap', visibility: { xs: data.length > 5 && index % 2 === 1 ? 'hidden' : 'visible', sm: 'visible' } }}>
            {d.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/**
 * Barras horizontales para un ranking corto, con el valor en la punta.
 * data: [{ key, label, sublabel, value }]
 */
export const BarList = ({ data, format = (v) => v }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2 }}>
      {data.map((d) => (
        <Box key={d.key} component="li">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, mb: 0.75 }}>
            <Typography noWrap sx={{ fontWeight: 600, fontSize: '0.9375rem' }} title={d.label}>
              {d.label}
            </Typography>
            <Typography className="tabular" sx={{ fontWeight: 650, fontSize: '0.9375rem', flexShrink: 0 }}>
              {format(d.value)}
              {d.sublabel && (
                <Box component="span" sx={{ ml: 1, fontWeight: 500, color: color.inkMuted }}>
                  {d.sublabel}
                </Box>
              )}
            </Typography>
          </Box>
          <Box sx={{ height: 8, borderRadius: '0 4px 4px 0', bgcolor: chart.grid }}>
            <Box sx={{ width: `${(d.value / max) * 100}%`, minWidth: d.value > 0 ? 4 : 0, height: '100%', borderRadius: '0 4px 4px 0', bgcolor: chart.series }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Texto dentro de un bloque: blanco sobre los tonos oscuros, tinta sobre el ámbar.
const INSIDE_TEXT = { Pendiente: color.ink };

/**
 * Barra segmentada: un total dividido en partes, con leyenda en el mismo orden.
 * data: [{ key, label, value, fill }]
 */
export const SegmentedBar = ({ data, unit = '' }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const parts = data.filter((d) => d.value > 0);
  if (total === 0) return null;

  return (
    <Box>
      <Box role="img" aria-label={parts.map((d) => `${d.label}: ${d.value} ${unit} (${Math.round((d.value / total) * 100)}%)`).join(', ')} sx={{ display: 'flex', gap: '2px', height: 28 }}>
        {parts.map((d) => {
          const share = d.value / total;
          return (
            <Tooltip key={d.key} title={<TipContent value={`${d.value} ${unit} · ${Math.round(share * 100)}%`} label={d.label} />} placement="top">
              <Box
                tabIndex={0}
                sx={{ flex: `${d.value} 0 0`, minWidth: 6, borderRadius: '4px', bgcolor: d.fill, display: 'flex', alignItems: 'center', px: 1, overflow: 'hidden', transition: 'filter 140ms ease', '&:hover, &:focus-visible': { filter: 'brightness(0.92)' } }}
              >
                {share >= 0.14 && (
                  <Box component="span" className="tabular" sx={{ fontSize: '0.75rem', fontWeight: 700, color: INSIDE_TEXT[d.key] || '#fff' }}>
                    {Math.round(share * 100)}%
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0, display: 'flex', flexWrap: 'wrap', columnGap: 2.5, rowGap: 0.5 }}>
        {parts.map((d) => (
          <Box key={d.key} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.8125rem', color: color.inkSoft }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: d.fill }} />
            {d.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
