import React, { useRef } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Reveal } from '../../components/ui/motion';
import { whatsappUrl } from '../../config/site';
import { color } from '../../theme/tokens';

/** Cierre de la portada con la foto de fondo en paralaje suave. */
const FinalCta = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <Box component="section" aria-labelledby="cta-titulo" sx={{ pt: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box ref={ref} sx={{ position: 'relative', overflow: 'hidden', borderRadius: { xs: '28px', md: '44px' }, bgcolor: color.olive[900], color: color.paper, minHeight: { xs: 440, md: 480 }, display: 'flex', alignItems: 'flex-end' }}>
          <Box component={motion.img} style={{ y }} src="/images/perro-playa.webp" alt="" loading="lazy" sx={{ position: 'absolute', inset: '-10% 0', width: '100%', height: '120%', objectFit: 'cover', objectPosition: '70% center' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(to top, rgba(47,54,24,0.94) 30%, rgba(47,54,24,0.35) 100%)', md: 'linear-gradient(90deg, rgba(47,54,24,0.95) 0%, rgba(47,54,24,0.82) 38%, rgba(47,54,24,0.1) 78%)' } }} />
          <Box sx={{ position: 'relative', p: { xs: 3.5, sm: 6, md: 9 }, maxWidth: 620 }}>
            <Reveal>
              <Typography variant="h2" id="cta-titulo" sx={{ color: color.paper }}>
                Encuentra el snack <em>perfecto</em> para tu compañero.
              </Typography>
              <Typography sx={{ mt: 2, fontSize: '1.0625rem', color: 'rgba(246, 242, 231, 0.82)', maxWidth: 460 }}>
                Descubre nuestra variedad de snacks premium naturales para perros y gatos.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                <Button component={Link} to="/productos" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={{ bgcolor: color.paper, color: color.olive[900], '&:hover': { bgcolor: color.white } }}>
                  Ver catálogo
                </Button>
                <Button
                  component="a"
                  href={whatsappUrl('Hola, quiero saber más sobre sus snacks.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  sx={{ color: color.paper, border: '1px solid rgba(246, 242, 231, 0.4)', '&:hover': { bgcolor: 'rgba(246, 242, 231, 0.1)', borderColor: color.paper } }}
                >
                  Escríbenos
                </Button>
              </Box>
            </Reveal>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FinalCta;
