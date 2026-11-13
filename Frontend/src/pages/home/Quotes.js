import React, { useEffect, useState } from 'react';
import { Box, Container, IconButton } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { color, ease, font } from '../../theme/tokens';
import { PawTrail } from '../../components/ui/PawPrint';

const QUOTES = [
  'El amor por todas las criaturas vivientes es el más noble atributo del hombre.',
  'Hasta que no hayas amado a un animal, una parte de tu alma permanecerá dormida.',
  'Los animales son amigos tan agradables: no hacen preguntas, no critican.',
  'La grandeza de una nación se puede juzgar por la forma en que trata a sus animales.',
];

/** Frases que inspiran a la marca. Rotan solas y se pausan al interactuar. */
const Quotes = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 6500);
    return () => clearInterval(timer);
  }, [paused, reduce]);

  const go = (step) => setIndex((i) => (i + step + QUOTES.length) % QUOTES.length);

  return (
    <Box
      component="section"
      aria-label="Lo que nos inspira"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{ py: { xs: 6, md: 9 } }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <PawTrail sx={{ mb: 3 }} />
        <Box sx={{ position: 'relative', minHeight: { xs: 210, sm: 170, md: 190 }, display: 'grid', placeItems: 'center' }}>
          <AnimatePresence mode="wait">
            <Box
              key={index}
              component={motion.blockquote}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.25, ease: 'easeIn' } }}
              transition={{ duration: 0.6, ease: ease.out }}
              aria-live="polite"
              sx={{
                m: 0,
                fontFamily: font.display,
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(1.5rem, 1.1rem + 2vw, 2.5rem)',
                lineHeight: 1.22,
                letterSpacing: '-0.02em',
                fontVariationSettings: "'SOFT' 100",
                color: color.cocoa,
                textWrap: 'balance',
              }}
            >
              “{QUOTES[index]}”
            </Box>
          </AnimatePresence>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <IconButton onClick={() => go(-1)} aria-label="Frase anterior" sx={{ width: 44, height: 44, border: `1px solid ${color.lineStrong}` }}>
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
          <Box className="tabular" sx={{ fontSize: '0.875rem', fontWeight: 650, color: color.inkMuted, minWidth: 44 }}>
            {index + 1} / {QUOTES.length}
          </Box>
          <IconButton onClick={() => go(1)} aria-label="Frase siguiente" sx={{ width: 44, height: 44, border: `1px solid ${color.lineStrong}` }}>
            <ArrowForwardRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Quotes;
