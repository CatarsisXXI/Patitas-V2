import React, { useEffect, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { color } from '../../theme/tokens';
import { PawPrint } from './PawPrint';

/**
 * Imagen con esqueleto de carga, entrada suave y respaldo visual si falla.
 * `ratio` (ancho/alto) reserva el espacio para evitar saltos de layout.
 * `blend` funde el fondo blanco de las fotos de producto con el color del contenedor.
 */
const SmartImage = ({ src, alt, ratio, fit = 'cover', position = 'center', radius = 0, eager = false, blend = false, className, sx, imgSx }) => {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        aspectRatio: ratio ? String(ratio) : undefined,
        bgcolor: color.sunken,
        ...sx,
      }}
    >
      {status === 'loading' && (
        <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, height: '100%', borderRadius: 0 }} />
      )}
      {status === 'error' ? (
        <Box
          role="img"
          aria-label={alt}
          sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(61, 38, 20, 0.22)' }}
        >
          <PawPrint size={44} />
        </Box>
      ) : (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          sx={{
            position: ratio ? 'absolute' : 'relative',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: position,
            opacity: status === 'loaded' ? 1 : 0,
            mixBlendMode: blend ? 'multiply' : 'normal',
            transition: 'opacity 320ms ease-out, transform 600ms cubic-bezier(0.23, 1, 0.32, 1)',
            ...imgSx,
          }}
        />
      )}
    </Box>
  );
};

export default SmartImage;
