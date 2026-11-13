import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { color, font } from '../../theme/tokens';
import { site } from '../../config/site';

/** Sello de la marca con el nombre al lado. */
const Logo = ({ to = '/', size = 44, showName = true, light = false, onClick }) => (
  <Box
    component={Link}
    to={to}
    onClick={onClick}
    aria-label={`${site.name}, ir al inicio`}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1.25,
      color: light ? color.paper : 'text.primary',
      '&:hover img': { transform: 'rotate(-8deg) scale(1.04)' },
    }}
  >
    <Box
      component="img"
      src="/images/logo.webp"
      alt=""
      width={size}
      height={size}
      sx={{ width: size, height: size, objectFit: 'contain', transition: 'transform 380ms cubic-bezier(0.23, 1, 0.32, 1)' }}
    />
    {showName && (
      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <Box component="span" sx={{ fontFamily: font.display, fontWeight: 600, fontSize: '1.1875rem', letterSpacing: '-0.02em', fontVariationSettings: "'SOFT' 100" }}>
          {site.name}
        </Box>
        <Box component="span" sx={{ mt: '3px', fontSize: '0.6875rem', fontWeight: 650, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.62 }}>
          {site.tagline}
        </Box>
      </Box>
    )}
  </Box>
);

export default Logo;
