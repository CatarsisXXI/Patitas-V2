import React from 'react';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { color, ease } from '../../theme/tokens';

/**
 * Encabezado de página: migas, sobretítulo, título, descripción y acciones.
 * `crumbs`: [{ label, to }] (la página actual se añade sola a partir de `title`).
 */
const PageHeader = ({ eyebrow, title, description, actions, crumbs, current, sx }) => (
  <Box
    component={motion.header}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: ease.out }}
    sx={{ mb: { xs: 3.5, md: 5 }, ...sx }}
  >
    {crumbs && (
      <Breadcrumbs aria-label="Ruta de navegación" separator="/" sx={{ mb: title ? 2 : 0, fontSize: '0.875rem', color: color.inkMuted }}>
        {crumbs.map((crumb) => (
          <Box
            key={crumb.to}
            component={RouterLink}
            to={crumb.to}
            sx={{ color: color.inkMuted, fontWeight: 500, '&:hover': { color: color.ink, textDecoration: 'underline', textUnderlineOffset: 3 } }}
          >
            {crumb.label}
          </Box>
        ))}
        <Typography component="span" aria-current="page" sx={{ fontSize: 'inherit', color: color.ink, fontWeight: 600 }} noWrap>
          {current || title}
        </Typography>
      </Breadcrumbs>
    )}
    {(title || actions) && (
    <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      <Box sx={{ maxWidth: 640 }}>
        {eyebrow && (
          <Typography variant="overline" component="p" sx={{ color: color.olive[600], mb: 1 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.0625rem' }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0, flexWrap: 'wrap' }}>{actions}</Box>}
    </Box>
    )}
  </Box>
);

export default PageHeader;
