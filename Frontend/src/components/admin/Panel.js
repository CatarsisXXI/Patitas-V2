import React from 'react';
import { Box, Typography } from '@mui/material';
import { color, radius } from '../../theme/tokens';

/** Contenedor de sección del panel: título, acción opcional y contenido. */
const Panel = ({ title, description, action, children, padded = true, sx }) => (
  <Box component="section" sx={{ borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}`, overflow: 'hidden', ...sx }}>
    {(title || action) && (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 3, pt: 2.5, pb: description ? 0 : 1.5 }}>
        <Typography variant="h4" component="h2">
          {title}
        </Typography>
        {action}
      </Box>
    )}
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ px: 3, pb: 1.5 }}>
        {description}
      </Typography>
    )}
    <Box sx={padded ? { px: 3, pb: 3 } : undefined}>{children}</Box>
  </Box>
);

export default Panel;
