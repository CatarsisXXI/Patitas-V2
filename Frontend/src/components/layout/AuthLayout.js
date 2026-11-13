import React, { Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import PageLoader from '../ui/PageLoader';
import { color, ease, font } from '../../theme/tokens';

/** Pantalla dividida para login y registro: formulario a la izquierda, foto de marca a la derecha. */
const AuthLayout = () => {
  const { pathname } = useLocation();

  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', px: { xs: 2.5, sm: 6 }, py: { xs: 2.5, sm: 4 } }}>
        <Logo size={44} />
        <Box component="main" id="contenido" sx={{ flex: 1, display: 'grid', placeItems: 'center', py: { xs: 5, md: 6 } }}>
          <Box
            component={motion.div}
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out }}
            sx={{ width: '100%', maxWidth: 420 }}
          >
            <Suspense fallback={<PageLoader minHeight={320} />}>
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' }, p: 2 }}>
        <Box
          sx={{
            position: 'sticky',
            top: 16,
            height: 'calc(100dvh - 32px)',
            borderRadius: '36px 36px 36px 120px',
            overflow: 'hidden',
            bgcolor: color.olive[900],
          }}
        >
          <Box
            component={motion.img}
            src="/images/perro-beagle.webp"
            alt="Un beagle sonriente mirando a la cámara"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: ease.out }}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(47, 54, 24, 0.86) 0%, rgba(47, 54, 24, 0.18) 46%, rgba(47, 54, 24, 0) 70%)' }} />
          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: { md: 5, lg: 7 }, color: color.paper }}>
            <Typography sx={{ fontFamily: font.display, fontSize: 'clamp(1.75rem, 2.6vw, 2.6rem)', lineHeight: 1.1, letterSpacing: '-0.02em', fontVariationSettings: "'SOFT' 100", maxWidth: 460 }}>
              Cuéntanos cómo es y te decimos qué snack le va <em>mejor</em>.
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 400, color: 'rgba(246, 242, 231, 0.8)' }}>
              Con tu cuenta registras a tu mascota, guardas favoritos y sigues tus pedidos.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
