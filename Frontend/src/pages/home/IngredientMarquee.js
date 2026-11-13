import React from 'react';
import { Box } from '@mui/material';
import { color, font } from '../../theme/tokens';
import { PawPrint } from '../../components/ui/PawPrint';

// Ingredientes que aparecen en las recetas del catálogo.
const INGREDIENTS = ['Algarrobo', 'Yacón', 'Cúrcuma', 'Linaza', 'Camote', 'Zapallo', 'Plátano', 'Aceite de oliva', 'Calabaza'];

const Row = ({ hidden }) => (
  <Box component="ul" aria-hidden={hidden || undefined} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, m: 0, p: 0, listStyle: 'none' }}>
    {INGREDIENTS.map((item) => (
      <Box key={item} component="li" sx={{ display: 'flex', alignItems: 'center', gap: { xs: 3, md: 5 }, pr: { xs: 3, md: 5 }, whiteSpace: 'nowrap' }}>
        <Box component="span" sx={{ fontFamily: font.display, fontStyle: 'italic', fontSize: { xs: '1.5rem', md: '2.1rem' }, letterSpacing: '-0.02em', fontVariationSettings: "'SOFT' 100", color: color.cocoa }}>
          {item}
        </Box>
        <Box component="span" sx={{ color: color.olive[300], display: 'inline-flex', transform: 'rotate(18deg)' }}>
          <PawPrint size={20} />
        </Box>
      </Box>
    ))}
  </Box>
);

/** Cinta continua con los ingredientes de la casa. Se detiene al pasar el cursor. */
const IngredientMarquee = () => (
  <Box
    component="section"
    aria-label="Ingredientes que usamos"
    sx={{
      py: { xs: 2.5, md: 3.5 },
      borderTop: `1px solid ${color.line}`,
      borderBottom: `1px solid ${color.line}`,
      overflow: 'hidden',
      maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      '&:hover .cinta': { animationPlayState: 'paused' },
    }}
  >
    <Box className="cinta" sx={{ display: 'flex', width: 'max-content', animation: 'marquee 38s linear infinite', '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
      <Row />
      <Row hidden />
    </Box>
  </Box>
);

export default IngredientMarquee;
