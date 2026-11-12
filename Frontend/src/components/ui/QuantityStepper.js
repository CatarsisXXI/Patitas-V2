import React from 'react';
import { Box, IconButton } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { AnimatePresence, motion } from 'framer-motion';
import { color, radius } from '../../theme/tokens';

/** Selector de cantidad con límites. El número se desliza al cambiar. */
const QuantityStepper = ({ value, onChange, min = 1, max = 99, disabled = false, size = 'medium', label = 'Cantidad' }) => {
  const dim = size === 'small' ? 32 : 40;
  const change = (next) => {
    if (next >= min && next <= max) onChange(next);
  };

  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${color.lineStrong}`,
        borderRadius: `${radius.pill}px`,
        bgcolor: color.surface,
        opacity: disabled ? 0.55 : 1,
        p: '3px',
      }}
    >
      <IconButton
        aria-label="Quitar una unidad"
        onClick={() => change(value - 1)}
        disabled={disabled || value <= min}
        sx={{ width: dim, height: dim }}
      >
        <RemoveRoundedIcon fontSize="small" />
      </IconButton>
      <Box
        aria-live="polite"
        className="tabular"
        sx={{ width: size === 'small' ? 28 : 36, height: dim, overflow: 'hidden', position: 'relative', fontWeight: 650, fontSize: size === 'small' ? '0.9375rem' : '1rem' }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </Box>
      <IconButton
        aria-label="Agregar una unidad"
        onClick={() => change(value + 1)}
        disabled={disabled || value >= max}
        sx={{ width: dim, height: dim }}
      >
        <AddRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default QuantityStepper;
