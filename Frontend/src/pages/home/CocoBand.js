import React from 'react';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal, Stagger, StaggerItem } from '../../components/ui/motion';
import { openCoco } from '../../components/chat/Chatbot';
import { useAuth } from '../../context/AuthContext';
import { color, ease, font, radius, shadow } from '../../theme/tokens';

const STEPS = [
  { title: 'Crea tu cuenta', text: 'Solo necesitas tu nombre y un correo.' },
  { title: 'Registra a tu mascota', text: 'Edad, tamaño, alergias, nivel de actividad y lo que quieres cuidar.' },
  { title: 'Pregúntale a Coco', text: 'Descarta lo que no le conviene y te muestra los snacks que sí.' },
];

const bubble = (delay) => ({
  initial: { opacity: 0, y: 14, scale: 0.96 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '0px 0px -15% 0px' },
  transition: { duration: 0.45, delay, ease: ease.out },
});

/** Presenta al asistente Coco y los pasos para recibir recomendaciones. */
const CocoBand = () => {
  const { user, isCustomer } = useAuth();
  const secondary = !user ? { to: '/registro', label: 'Crear cuenta' } : isCustomer ? { to: '/mascotas', label: 'Ir a mis mascotas' } : null;

  return (
    <Box component="section" aria-labelledby="coco-titulo" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '28px', md: '44px' },
            bgcolor: color.sunken,
            px: { xs: 3, sm: 5, md: 9 },
            py: { xs: 6, md: 10 },
            display: 'grid',
            alignItems: 'center',
            gap: { xs: 6, md: 8 },
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box>
            <Reveal>
              <Typography variant="overline" component="p" sx={{ color: color.olive[600], mb: 1.25 }}>
                Asistente con IA
              </Typography>
              <Typography variant="h2" id="coco-titulo">
                Coco conoce a tu mascota antes de <em>recomendar</em>.
              </Typography>
            </Reveal>

            <Stagger as="ol" delay={0.15} style={{ listStyle: 'none', margin: '36px 0 0', padding: 0, display: 'grid', gap: 22 }}>
              {STEPS.map((step, index) => (
                <StaggerItem as="li" key={step.title} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', columnGap: 16, alignItems: 'start' }}>
                  <Box className="tabular" sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: '50%', border: `1.5px solid ${color.olive[500]}`, color: color.olive[700], fontFamily: font.display, fontSize: '1.125rem', fontStyle: 'italic' }}>
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="h3">
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">{step.text}</Typography>
                  </Box>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.25}>
              <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                <Button onClick={openCoco} variant="contained" size="large">
                  Hablar con Coco
                </Button>
                {secondary && (
                  <Button component={Link} to={secondary.to} variant="outlined" size="large">
                    {secondary.label}
                  </Button>
                )}
              </Box>
            </Reveal>
          </Box>

          {/* Vista previa ilustrativa del chat */}
          <Box aria-hidden="true" sx={{ position: 'relative', mx: 'auto', width: '100%', maxWidth: 400 }}>
            <Box sx={{ p: { xs: 2.5, md: 3 }, borderRadius: `${radius.lg}px`, bgcolor: color.paper, border: `1px solid ${color.line}`, boxShadow: shadow.lg, transform: { md: 'rotate(2deg)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2, mb: 2.5, borderBottom: `1px solid ${color.line}` }}>
                <Avatar src="/images/coco.webp" alt="" sx={{ width: 44, height: 44 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>Coco</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Asistente de recomendaciones
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gap: 1.25, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                <Box component={motion.div} {...bubble(0.2)} sx={{ justifySelf: 'start', maxWidth: '86%', px: 1.75, py: 1.25, bgcolor: color.surface, border: `1px solid ${color.line}`, borderRadius: '16px 16px 16px 4px' }}>
                  Hola. Puedo sugerirte snacks según el perfil de tu mascota.
                </Box>
                <Box component={motion.div} {...bubble(0.7)} sx={{ justifySelf: 'end', maxWidth: '86%', px: 1.75, py: 1.25, bgcolor: color.olive[600], color: color.surface, borderRadius: '16px 16px 4px 16px' }}>
                  Recomiéndame un snack
                </Box>
                <Box component={motion.div} {...bubble(1.2)} sx={{ justifySelf: 'start', maxWidth: '86%', px: 1.75, py: 1.25, bgcolor: color.surface, border: `1px solid ${color.line}`, borderRadius: '16px 16px 16px 4px' }}>
                  Tomé en cuenta sus alergias, sus objetivos, su actividad y su etapa de vida.
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
                    {['Alergias', 'Objetivos', 'Actividad', 'Etapa'].map((tag) => (
                      <Box key={tag} component="span" sx={{ px: 1, py: 0.25, borderRadius: `${radius.xs}px`, bgcolor: color.olive[100], color: color.olive[700], fontSize: '0.75rem', fontWeight: 650 }}>
                        {tag}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CocoBand;
