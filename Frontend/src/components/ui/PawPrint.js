import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { color, ease } from '../../theme/tokens';

/** Huella de la marca. Hereda el color del texto (currentColor). */
export const PawPrint = ({ size = 24, style, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" style={style} {...rest}>
    <ellipse cx="14" cy="27" rx="6" ry="7.6" transform="rotate(-18 14 27)" />
    <ellipse cx="25" cy="15" rx="6.2" ry="8" transform="rotate(-6 25 15)" />
    <ellipse cx="39" cy="15" rx="6.2" ry="8" transform="rotate(6 39 15)" />
    <ellipse cx="50" cy="27" rx="6" ry="7.6" transform="rotate(18 50 27)" />
    <path d="M32 29c-8 0-16.5 8.6-16.5 16.8 0 5.3 3.9 8.4 8.7 8.4 3.2 0 5.1-1.5 7.8-1.5s4.6 1.5 7.8 1.5c4.8 0 8.7-3.1 8.7-8.4C48.5 37.6 40 29 32 29z" />
  </svg>
);

const STEPS = [
  { x: 4, y: 58, r: -20 },
  { x: 16, y: 20, r: 12 },
  { x: 30, y: 60, r: -14 },
  { x: 43, y: 22, r: 16 },
  { x: 57, y: 58, r: -10 },
  { x: 70, y: 18, r: 18 },
  { x: 84, y: 54, r: -8 },
];

/**
 * Rastro de huellas que "camina" de izquierda a derecha al entrar en pantalla.
 * Decorativo: separa secciones sin competir con el contenido.
 */
export const PawTrail = ({ tone = color.olive[300], sx }) => (
  <Box
    aria-hidden="true"
    component={motion.div}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '0px 0px -15% 0px' }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
    sx={{ position: 'relative', height: 84, maxWidth: 520, mx: 'auto', color: tone, pointerEvents: 'none', ...sx }}
  >
    {STEPS.map((step, index) => (
      <motion.span
        key={index}
        variants={{
          hidden: { opacity: 0, scale: 0.6 },
          show: { opacity: 1 - index * 0.06, scale: 1, transition: { duration: 0.35, ease: ease.out } },
        }}
        style={{ position: 'absolute', left: `${step.x}%`, top: `${step.y}%`, rotate: step.r + 90, marginTop: -11, display: 'block' }}
      >
        <PawPrint size={22} />
      </motion.span>
    ))}
  </Box>
);

export default PawPrint;
