import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SectionHeading from '../../components/ui/SectionHeading';
import { Reveal } from '../../components/ui/motion';
import { color, font } from '../../theme/tokens';

const VALUES = [
  {
    title: 'Calidad y transparencia',
    text: 'Elaboramos cada snack con ingredientes naturales y procesos caseros de alta calidad, siempre con información clara y honesta para generar confianza en cada familia.',
    image: '/images/valor-calidad.webp',
    alt: 'Preparación casera de snacks: un bol con ingredientes, frascos etiquetados y galletas en una bandeja',
    corner: '36px 36px 140px 36px',
  },
  {
    title: 'Bienestar integral',
    text: 'Trabajamos por la salud y felicidad de las mascotas, entendiendo su cuidado como parte esencial del bienestar familiar.',
    image: '/images/valor-bienestar.webp',
    alt: 'Una familia sentada en la alfombra de la sala jugando con su perro y su gato',
    corner: '36px 36px 36px 140px',
  },
  {
    title: 'Cuidado personalizado',
    text: 'Gracias a la IA, ofrecemos recomendaciones adaptadas a las necesidades únicas de cada peludito, creando vínculos cercanos y experiencias realmente pensadas para ellos.',
    image: '/images/valor-cuidado.webp',
    alt: 'Una mujer le muestra a su perro blanco una tableta con su perfil',
    corner: '36px 36px 140px 36px',
  },
];

/** Valores en zig-zag: la imagen alterna de lado en cada fila. */
const Values = () => (
  // overflow hidden: las imágenes entran desplazadas desde un lado y no deben ensanchar la página.
  <Box component="section" id="valores" aria-labelledby="valores-titulo" sx={{ py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
    <Container maxWidth="lg">
      <SectionHeading id="valores-titulo" eyebrow="Nuestros valores" title="Tres ideas detrás de cada receta" />

      <Box sx={{ display: 'grid', gap: { xs: 7, md: 12 } }}>
        {VALUES.map((value, index) => {
          const flip = index % 2 === 1;
          return (
            <Box key={value.title} sx={{ display: 'grid', alignItems: 'center', gap: { xs: 3, md: 9 }, gridTemplateColumns: { xs: '1fr', md: flip ? '5fr 6fr' : '6fr 5fr' } }}>
              <Box sx={{ order: { md: flip ? 2 : 1 } }}>
              <Reveal x={flip ? 40 : -40} y={0} duration={0.7}>
                <Box sx={{ borderRadius: { xs: '28px', md: value.corner }, overflow: 'hidden', aspectRatio: '6 / 5', bgcolor: color.sunken, '&:hover img': { transform: 'scale(1.04)' } }}>
                  <Box component="img" src={value.image} alt={value.alt} loading="lazy" width={1024} height={860} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 900ms cubic-bezier(0.23, 1, 0.32, 1)' }} />
                </Box>
              </Reveal>
              </Box>
              <Box sx={{ order: { md: flip ? 1 : 2 } }}>
              <Reveal delay={0.12}>
                <Box sx={{ maxWidth: 440, ml: { md: flip ? 'auto' : 0 } }}>
                  <Box component="span" aria-hidden="true" className="tabular" sx={{ display: 'block', fontFamily: font.display, fontStyle: 'italic', fontSize: '1.375rem', color: color.olive[500], mb: 1.5 }}>
                    0{index + 1}
                  </Box>
                  <Typography variant="h3">{value.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.0625rem' }}>
                    {value.text}
                  </Typography>
                </Box>
              </Reveal>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Container>
  </Box>
);

export default Values;
