import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { color, ease } from '../../theme/tokens';
import { PawPrint } from './PawPrint';

/** Estado vacío o de error con una acción clara para continuar. */
const EmptyState = ({ icon, title, description, action, secondaryAction, compact = false, sx }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: ease.out }}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      mx: 'auto',
      maxWidth: 460,
      py: compact ? 5 : { xs: 8, md: 12 },
      px: 2,
      ...sx,
    }}
  >
    <Box
      sx={{
        width: 76,
        height: 76,
        mb: 3,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '28px 28px 28px 8px',
        bgcolor: color.olive[100],
        color: color.olive[700],
        transform: 'rotate(-4deg)',
        '& svg': { fontSize: 32 },
      }}
    >
      {icon || <PawPrint size={34} />}
    </Box>
    <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" sx={{ mb: action ? 3.5 : 0 }}>
        {description}
      </Typography>
    )}
    {(action || secondaryAction) && (
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {action}
        {secondaryAction}
      </Box>
    )}
  </Box>
);

export default EmptyState;
