import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { color, radius } from '../../theme/tokens';

/** Cifra destacada del panel: etiqueta, valor y nota opcional. */
const StatTile = ({ label, value, hint, icon, loading = false }) => (
  <Box sx={{ p: 2.5, borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}`, minWidth: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      {icon && (
        <Box aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: `${radius.sm}px`, bgcolor: color.olive[100], color: color.olive[700], '& svg': { fontSize: 18 } }}>
          {icon}
        </Box>
      )}
    </Box>
    <Typography component="p" sx={{ mt: 1, fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 650, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
      {loading ? <Skeleton width={96} /> : value}
    </Typography>
    {hint && (
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
        {loading ? <Skeleton width={120} /> : hint}
      </Typography>
    )}
  </Box>
);

export const StatGrid = ({ children }) => (
  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, mb: 3 }}>{children}</Box>
);

export default StatTile;
