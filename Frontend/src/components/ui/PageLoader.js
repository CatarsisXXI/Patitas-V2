import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { color } from '../../theme/tokens';
import { PawPrint } from './PawPrint';

/** Indicador mientras se descarga el código de una página. */
const PageLoader = ({ minHeight = '60vh' }) => (
  <Box role="status" aria-label="Cargando" sx={{ minHeight, display: 'grid', placeItems: 'center', color: color.olive[300] }}>
    <Box sx={{ display: 'flex', gap: 1.25 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -6, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
          style={{ display: 'inline-flex', rotate: 90 }}
        >
          <PawPrint size={22} />
        </motion.span>
      ))}
    </Box>
  </Box>
);

export default PageLoader;
