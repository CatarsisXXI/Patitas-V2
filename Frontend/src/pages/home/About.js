import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Reveal, Stagger, StaggerItem } from '../../components/ui/motion';
import { color } from '../../theme/tokens';

const BLOCKS = [
  {
    title: 'Misión',
    text: 'Crear snacks naturales que cuiden la salud y felicidad de cada mascota, combinando ingredientes reales con tecnología de IA que nos permite recomendar la opción perfecta para cada peludito. Trabajamos con cariño, responsabilidad y sostenibilidad para acompañar a las familias en el bienestar de sus mejores amigos.',
  },
  {
    title: 'Visión',
    text: 'Ser la marca peruana líder en snacks naturales personalizados para mascotas, reconocida por nuestra innovación, calidad y compromiso con una alimentación más saludable. Queremos inspirar a miles de familias a nutrir mejor a sus peluditos con ayuda de la inteligencia artificial.',
  },
  {
    title: 'Nuestra historia',
    text: 'Fundada en 2025 por amantes de los animales, Patitas y Sabores nació de la pasión por cuidar a nuestras mascotas de manera natural y saludable. Comenzamos como un pequeño emprendimiento y esperamos llegar a miles de hogares.',
  },
];

/** Sobre nosotros: foto fija a la izquierda y misión, visión e historia a la derecha. */
const About = () => (
  <Box component="section" id="nosotros" aria-labelledby="nosotros-titulo" sx={{ py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'grid', gap: { xs: 5, md: 10 }, gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' }, alignItems: 'start' }}>
        <Box sx={{ position: { md: 'sticky' }, top: { md: 'calc(var(--nav-h) + 32px)' } }}>
          <Reveal>
            <Typography variant="overline" component="p" sx={{ color: color.olive[600], mb: 1.25 }}>
              Sobre nosotros
            </Typography>
            <Typography variant="h2" id="nosotros-titulo">
              Un emprendimiento que nació por <em>ellos</em>.
            </Typography>
          </Reveal>
          <Reveal delay={0.12}>
            <Box sx={{ mt: 4, borderRadius: '36px 120px 36px 36px', overflow: 'hidden', aspectRatio: '4 / 3', bgcolor: color.sunken }}>
              <Box component="img" src="/images/perros-corgis.webp" alt="Dos perros de orejas grandes mirando a la cámara con la boca abierta" loading="lazy" width={1280} height={857} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Reveal>
        </Box>

        <Stagger stagger={0.12} style={{ display: 'grid' }}>
          {BLOCKS.map((block, index) => (
            <StaggerItem key={block.title}>
              <Box sx={{ py: { xs: 3.5, md: 5 }, borderTop: index === 0 ? { md: `1px solid ${color.lineStrong}` } : `1px solid ${color.line}`, borderBottom: index === BLOCKS.length - 1 ? `1px solid ${color.line}` : 'none' }}>
                <Typography variant="h3">{block.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.0625rem', maxWidth: '62ch' }}>
                  {block.text}
                </Typography>
              </Box>
            </StaggerItem>
          ))}
        </Stagger>
      </Box>
    </Container>
  </Box>
);

export default About;
