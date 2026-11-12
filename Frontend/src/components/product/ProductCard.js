import React, { useState } from 'react';
import { Box, Button, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { assetUrl } from '../../config/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { splitNombre, stockStatus } from '../../lib/productCopy';
import { color, ease, radius, shadow } from '../../theme/tokens';
import SmartImage from '../ui/SmartImage';
import StatusChip from '../ui/StatusChip';
import ProductQuickView from './ProductQuickView';
import { useProductActions } from './useProductActions';

/** Tarjeta de producto del catálogo. */
const ProductCard = ({ product }) => {
  const [quickView, setQuickView] = useState(false);
  const { addToCart, adding, justAdded, favorite, toggleFav } = useProductActions(product);
  const { titulo, detalle } = splitNombre(product.nombre);
  const status = stockStatus(product.stock);
  const soldOut = status.key === 'out';
  const href = `/productos/${product.productoID}`;

  return (
    <>
      <Box
        component="article"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: `${radius.lg}px`,
          bgcolor: color.surface,
          border: `1px solid ${color.line}`,
          transition: `transform 320ms ${ease.css.out}, box-shadow 320ms ${ease.css.out}, border-color 200ms ease`,
          '@media (hover: hover)': {
            '&:hover': { transform: 'translateY(-4px)', boxShadow: shadow.md, borderColor: 'transparent' },
            '&:hover .pc-img img': { transform: 'scale(1.06) rotate(-1.5deg)' },
            '&:hover .pc-quick, &:focus-within .pc-quick': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box sx={{ position: 'relative', p: 1.25, pb: 0 }}>
          <Box component={Link} to={href} tabIndex={-1} aria-hidden="true" sx={{ display: 'block' }}>
            <SmartImage
              className="pc-img"
              src={assetUrl(product.imagenURL)}
              alt=""
              ratio={1}
              fit="contain"
              blend
              radius={radius.md}
              sx={{ bgcolor: color.sunken, filter: soldOut ? 'grayscale(0.6) opacity(0.75)' : 'none' }}
              imgSx={{ p: 2 }}
            />
          </Box>

          {status.key !== 'ok' && <StatusChip label={status.label} tone={status.tone} size="small" sx={{ position: 'absolute', top: { xs: 'auto', sm: 22 }, bottom: { xs: 10, sm: 'auto' }, left: { xs: 20, sm: 22 } }} />}

          <Tooltip title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
            <IconButton
              onClick={toggleFav}
              aria-label={favorite ? `Quitar ${titulo} de favoritos` : `Guardar ${titulo} en favoritos`}
              aria-pressed={favorite}
              sx={{
                position: 'absolute',
                top: 18,
                right: 18,
                zIndex: 1,
                width: 40,
                height: 40,
                bgcolor: 'rgba(255, 253, 248, 0.92)',
                color: favorite ? color.danger.main : color.inkSoft,
                '&:hover': { bgcolor: color.surface, color: color.danger.main },
              }}
            >
              <motion.span key={String(favorite)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 14 }} style={{ display: 'inline-flex' }}>
                {favorite ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
              </motion.span>
            </IconButton>
          </Tooltip>

          <Button
            className="pc-quick"
            onClick={() => setQuickView(true)}
            size="small"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              position: 'absolute',
              left: '50%',
              bottom: 12,
              ml: '-62px',
              zIndex: 1,
              width: 124,
              bgcolor: color.ink,
              color: color.paper,
              opacity: 0,
              transform: 'translateY(8px)',
              transition: `opacity 200ms ease, transform 260ms ${ease.css.out}`,
              '&:hover': { bgcolor: color.cocoa },
              '&:focus-visible': { opacity: 1, transform: 'translateY(0)' },
            }}
          >
            Vista rápida
          </Button>
        </Box>

        <Box sx={{ p: 2.25, pt: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {product.categoriaNombre && (
            <Typography variant="overline" sx={{ color: color.inkMuted, fontSize: '0.6875rem', mb: 0.5 }}>
              {product.categoriaNombre}
            </Typography>
          )}
          <Typography
            component={Link}
            to={href}
            variant="h5"
            sx={{
              display: 'block',
              color: 'text.primary',
              // El enlace del título cubre toda la tarjeta para que sea un solo objetivo de clic.
              '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: `${radius.lg}px` },
              '&:focus-visible': { outline: 'none' },
              '&:focus-visible::after': { outline: `2px solid ${color.olive[600]}`, outlineOffset: 2 },
            }}
          >
            {titulo}
          </Typography>
          {detalle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {detalle}
            </Typography>
          )}

          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography className="tabular" sx={{ fontSize: '1.1875rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {formatCurrency(product.precio)}
            </Typography>
            <Tooltip title={soldOut ? 'Sin stock por ahora' : 'Agregar al carrito'}>
              <span style={{ position: 'relative', zIndex: 1 }}>
                <IconButton
                  onClick={() => addToCart(1)}
                  disabled={soldOut || adding}
                  aria-label={soldOut ? `${titulo} agotado` : `Agregar ${titulo} al carrito`}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: justAdded ? color.success.main : color.olive[600],
                    color: color.surface,
                    '&:hover': { bgcolor: justAdded ? color.success.main : color.olive[700], color: color.surface },
                    '&.Mui-disabled': { bgcolor: 'rgba(61, 38, 20, 0.08)', color: 'rgba(43, 27, 16, 0.3)' },
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={justAdded ? 'ok' : 'add'}
                      initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: 'inline-flex' }}
                    >
                      {justAdded ? <CheckRoundedIcon /> : <AddRoundedIcon />}
                    </motion.span>
                  </AnimatePresence>
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

      </Box>

      <ProductQuickView product={product} open={quickView} onClose={() => setQuickView(false)} />
    </>
  );
};

export const ProductCardSkeleton = () => (
  <Box sx={{ borderRadius: `${radius.lg}px`, bgcolor: color.surface, border: `1px solid ${color.line}`, p: 1.25 }}>
    <Skeleton variant="rounded" sx={{ aspectRatio: '1', height: 'auto', width: '100%' }} />
    <Box sx={{ p: 1, pt: 2 }}>
      <Skeleton width="38%" height={14} />
      <Skeleton width="82%" height={26} />
      <Skeleton width="60%" height={18} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Skeleton width={72} height={28} />
        <Skeleton variant="circular" width={44} height={44} />
      </Box>
    </Box>
  </Box>
);

/** Grilla fluida de tarjetas: las columnas se ajustan solas al ancho disponible. */
export const ProductGrid = ({ children, min = 232, sx }) => (
  <Box sx={{ display: 'grid', gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: `repeat(auto-fill, minmax(${min}px, 1fr))` }, ...sx }}>
    {children}
  </Box>
);

export default ProductCard;
