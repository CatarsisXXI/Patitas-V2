import React from 'react';
import { Box, Typography } from '@mui/material';
import { color } from '../../theme/tokens';
import { Reveal } from './motion';

/** Título de sección con sobretítulo. `action` se alinea a la derecha en escritorio. */
const SectionHeading = ({ eyebrow, title, description, action, align = 'left', id, maxWidth = 620, sx }) => (
  <Reveal>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: align === 'center' ? 'column' : 'row' },
        alignItems: { xs: align === 'center' ? 'center' : 'flex-start', md: align === 'center' ? 'center' : 'flex-end' },
        justifyContent: 'space-between',
        textAlign: align,
        gap: 3,
        mb: { xs: 4, md: 6 },
        ...sx,
      }}
    >
      <Box sx={{ maxWidth }}>
        {eyebrow && (
          <Typography variant="overline" component="p" sx={{ color: color.olive[600], mb: 1.25 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h2" id={id}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.0625rem' }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  </Reveal>
);

export default SectionHeading;
