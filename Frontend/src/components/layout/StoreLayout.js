import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import Chatbot from '../chat/Chatbot';
import PageLoader from '../ui/PageLoader';
import { ease } from '../../theme/tokens';

/** Estructura de la tienda: navegación, contenido animado por ruta, pie, carrito y asistente. */
const StoreLayout = () => {
  const { pathname } = useLocation();

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <Box
        component={motion.main}
        id="contenido"
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: ease.out }}
        sx={{ minHeight: 'calc(100dvh - var(--nav-h))' }}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Box>
      <Footer />
      <CartDrawer />
      <Chatbot />
    </>
  );
};

export default StoreLayout;
