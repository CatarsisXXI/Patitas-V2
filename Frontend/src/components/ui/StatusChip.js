import React from 'react';
import { Box } from '@mui/material';
import { color, radius } from '../../theme/tokens';
import { ORDER_STATUS } from '../../lib/orders';

const TONES = {
  success: { fg: color.success.main, bg: color.success.tint },
  warning: { fg: color.warning.main, bg: color.warning.tint },
  danger: { fg: color.danger.main, bg: color.danger.tint },
  info: { fg: color.info.main, bg: color.info.tint },
  neutral: { fg: color.inkSoft, bg: color.sunken },
};

/** Etiqueta de estado con punto de color. Acepta `tone` o un estado de pedido. */
const StatusChip = ({ label, tone = 'neutral', status, size = 'medium', sx }) => {
  const config = status ? ORDER_STATUS[status] || { ...TONES.neutral, label: status } : TONES[tone] || TONES.neutral;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: size === 'small' ? 1 : 1.25,
        height: size === 'small' ? 22 : 26,
        borderRadius: `${radius.xs}px`,
        bgcolor: config.bg,
        color: config.fg,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        fontWeight: 650,
        whiteSpace: 'nowrap',
        ...sx,
      }}
    >
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
      {label || config.label}
    </Box>
  );
};

export default StatusChip;
