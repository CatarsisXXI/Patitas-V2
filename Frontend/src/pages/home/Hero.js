import React from 'react';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { color, ease, font, radius, shadow } from '../../theme/tokens';
import { assetUrl } from '../../config/api';
import { splitNombre } from '../../lib/productCopy';
import { formatCurrency } from '../../utils/formatCurrency';
import { PawPrint } from '../../components/ui/PawPrint';
import { openCoco } from '../../components/chat/Chatbot';

const PROOFS = ['Ingredientes naturales', 'Receta casera', 'Recomendación a medida'];

/** Línea del titular que sube desde una máscara. */
const Line = ({ children, delay }) => (
  <Box component="span" sx={{ display: 'block', overflow: 'hidden', pb: '0.12em', mb: '-0.12em' }}>
    <motion.span style={{ display: 'block' }} initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay, ease: ease.out }}>
      {children}
    </motion.span>
  </Box>
);

const fade = (delay) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: ease.out } });

const Stamp = () => (
  <Box sx={{ position: 'relative', width: { xs: 92, md: 124 }, height: { xs: 92, md: 124 }, borderRadius: '50%', bgcolor: color.paper, boxShadow: shadow.md, color: color.olive[700] }}>
    <Box component="svg" viewBox="0 0 120 120" sx={{ width: '100%', height: '100%', animation: 'spin-slow 26s linear infinite' }} aria-hidden="true">
      <defs>
        <path id="sello-circulo" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text fill="currentColor" fontSize="10.5" fontWeight="700" letterSpacing="1.5" style={{ fontFamily: font.body, textTransform: 'uppercase' }}>
        <textPath href="#sello-circulo" textLength="270" lengthAdjust="spacing">
          Amor natural · Hecho con cariño ·
        </textPath>
      </text>
    </Box>
    <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: color.cocoa }}>
      <PawPrint size={30} />
    </Box>
  </Box>
);

const Hero = ({ product }) => {
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 700], [0, -46]);
  const cardY = useTransform(scrollY, [0, 700], [0, -96]);
  const blobY = useTransform(scrollY, [0, 700], [0, 60]);
  const name = product ? splitNombre(product.nombre) : null;

  return (
    <Box component="section" aria-labelledby="hero-titulo" sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 3, md: 5 }, pb: { xs: 7, md: 11 } }}>
      <Box
        component={motion.div}
        aria-hidden="true"
        style={{ y: blobY }}
        sx={{
          position: 'absolute',
          right: { xs: '-40%', md: '-8%' },
          top: { xs: '34%', md: '-12%' },
          width: { xs: '120%', md: '58%' },
          aspectRatio: '1',
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${color.olive[100]} 0%, rgba(228, 231, 200, 0) 100%)`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ display: 'grid', alignItems: 'center', gap: { xs: 6, md: 4 }, gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' } }}>
          <Box sx={{ maxWidth: 600 }}>
            <Box component={motion.div} {...fade(0.05)} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, pl: 1, pr: 1.75, py: 0.75, mb: 3, borderRadius: `${radius.pill}px`, bgcolor: color.surface, border: `1px solid ${color.line}`, fontSize: '0.8125rem', fontWeight: 650, color: color.inkSoft }}>
              <Box component="span" sx={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%', bgcolor: color.olive[600], color: color.surface }}>
                <PawPrint size={13} />
              </Box>
              Snacks naturales para perros y gatos
            </Box>

            <Typography variant="h1" id="hero-titulo">
              <Line delay={0.1}>Amor</Line>
              <Line delay={0.18}>
                <Box component="em" sx={{ color: color.olive[600], fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
                  natural
                </Box>{' '}
                en cada
              </Line>
              <Line delay={0.26}>bocado.</Line>
            </Typography>

            <Typography component={motion.p} {...fade(0.45)} sx={{ mt: 3, maxWidth: 500, fontSize: { xs: '1.0625rem', md: '1.1875rem' }, lineHeight: 1.6, color: 'text.secondary' }}>
              Galletas y bocaditos caseros con ingredientes reales como algarrobo, yacón y cúrcuma. Cuéntanos cómo es tu mascota y te decimos cuál le va mejor.
            </Typography>

            <Box component={motion.div} {...fade(0.55)} sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
              <Button component={Link} to="/productos" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>
                Ver catálogo
              </Button>
              <Button onClick={openCoco} variant="text" size="large" sx={{ pl: 1 }} startIcon={<Avatar src="/images/coco.webp" alt="" sx={{ width: 34, height: 34 }} />}>
                Pregúntale a Coco
              </Button>
            </Box>

            <Box component={motion.ul} {...fade(0.7)} sx={{ listStyle: 'none', p: 0, m: 0, mt: { xs: 4, md: 6 }, display: 'flex', flexWrap: 'wrap', columnGap: 3, rowGap: 1 }}>
              {PROOFS.map((proof) => (
                <Box key={proof} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.9063rem', fontWeight: 600, color: color.inkSoft }}>
                  <CheckRoundedIcon sx={{ fontSize: 18, color: color.olive[600] }} />
                  {proof}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ position: 'relative', mx: 'auto', width: '100%', maxWidth: { xs: 400, md: 480 }, pb: { xs: 5, md: 6 } }}>
            <Box
              component={motion.div}
              style={{ y: photoY }}
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: ease.out }}
              sx={{ ml: { xs: 4, md: 7 }, borderRadius: '999px 999px 36px 36px', overflow: 'hidden', aspectRatio: '4 / 5', bgcolor: color.sunken, boxShadow: shadow.lg }}
            >
              <Box component="img" src="/images/perro-sendero.webp" alt="Perro de pelaje dorado sentado en un sendero, mirando hacia arriba con la lengua afuera" width={960} height={1200} fetchPriority="high" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>

            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.7 }}
              sx={{ position: 'absolute', top: { xs: 8, md: 20 }, left: { xs: 0, md: 8 } }}
            >
              <Stamp />
            </Box>

            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -30, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: -5 }}
              transition={{ duration: 0.8, delay: 0.5, ease: ease.out }}
              sx={{ position: 'absolute', left: 0, bottom: 0, width: '44%', borderRadius: `${radius.lg}px`, overflow: 'hidden', border: `6px solid ${color.paper}`, boxShadow: shadow.md, aspectRatio: '6 / 5', bgcolor: color.sunken }}
            >
              <Box component="img" src="/images/valor-calidad.webp" alt="Manos preparando la masa de los snacks en una cocina, junto a frascos de ingredientes" width={1024} height={860} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>

            {product && (
              <Box component={motion.div} style={{ y: cardY }} sx={{ position: 'absolute', right: { xs: -4, md: -28 }, bottom: { xs: 28, md: 56 }, width: { xs: 168, md: 196 } }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.85 }}
                >
                  <Box
                    component={Link}
                    to={`/productos/${product.productoID}`}
                    sx={{
                      display: 'block',
                      p: 1.5,
                      borderRadius: `${radius.lg}px`,
                      bgcolor: color.surface,
                      border: `1px solid ${color.line}`,
                      boxShadow: shadow.lg,
                      '--tilt': '3deg',
                      animation: 'float-soft 6s ease-in-out infinite',
                      transition: `box-shadow 240ms ${ease.css.out}`,
                      '&:hover img': { transform: 'scale(1.06)' },
                    }}
                  >
                    <Box sx={{ borderRadius: `${radius.md}px`, bgcolor: color.sunken, aspectRatio: '1', overflow: 'hidden', p: 1.25 }}>
                      <Box component="img" src={assetUrl(product.imagenURL)} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: `transform 500ms ${ease.css.out}` }} />
                    </Box>
                    <Typography sx={{ mt: 1.25, fontWeight: 650, fontSize: '0.875rem', lineHeight: 1.3 }}>{name.titulo}</Typography>
                    <Typography className="tabular" sx={{ fontSize: '0.875rem', color: color.olive[700], fontWeight: 700 }}>
                      {formatCurrency(product.precio)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
