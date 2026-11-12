import React from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../theme/tokens';

// Primitivas de animación de entrada. Solo se animan opacity y transform.

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

/** Aparece con un leve desplazamiento al entrar en pantalla. */
export const Reveal = ({ children, delay = 0, y = 22, x = 0, duration = 0.55, as = 'div', ...rest }) => {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: ease.out }}
      {...rest}
    >
      {children}
    </Component>
  );
};

const groupVariants = (stagger, delay) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
};

/** Contenedor que revela a sus <StaggerItem> en cascada. */
export const Stagger = ({ children, stagger = 0.07, delay = 0, inView = true, as = 'div', ...rest }) => {
  const Component = motion[as] || motion.div;
  const trigger = inView ? { whileInView: 'show', viewport: VIEWPORT } : { animate: 'show' };
  return (
    <Component variants={groupVariants(stagger, delay)} initial="hidden" {...trigger} {...rest}>
      {children}
    </Component>
  );
};

export const StaggerItem = ({ children, as = 'div', ...rest }) => {
  const Component = motion[as] || motion.div;
  return (
    <Component variants={itemVariants} {...rest}>
      {children}
    </Component>
  );
};
