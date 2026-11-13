import React from 'react';
import { Box, Button, Dialog, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { assetUrl } from '../../config/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { parseDescripcion, splitNombre, stockStatus } from '../../lib/productCopy';
import { color } from '../../theme/tokens';
import SmartImage from '../ui/SmartImage';
import StatusChip from '../ui/StatusChip';
import { CopyBlocks } from './ProductCopy';
import { useProductActions } from './useProductActions';

/** Vista rápida: lo esencial del producto sin salir del catálogo. */
const ProductQuickView = ({ product, open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, adding } = useProductActions(product);
  const { titulo, detalle } = splitNombre(product.nombre);
  const { intro, sections } = parseDescripcion(product.descripcion);
  const status = stockStatus(product.stock);
  const lead = sections.find((s) => s.key === 'perfil')?.body || intro;
  const benefits = sections.find((s) => s.key === 'beneficios');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen} aria-labelledby={`vista-rapida-${product.productoID}`}>
      <IconButton onClick={onClose} aria-label="Cerrar vista rápida" sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1, width: 44, height: 44, bgcolor: 'rgba(255, 253, 248, 0.9)' }}>
        <CloseRoundedIcon />
      </IconButton>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '5fr 6fr' }, minHeight: { sm: 460 } }}>
        <Box sx={{ bgcolor: color.sunken, display: 'grid', placeItems: 'center', p: { xs: 3, sm: 4 } }}>
          <SmartImage src={assetUrl(product.imagenURL)} alt={product.nombre} fit="contain" blend ratio={1} eager sx={{ width: '100%', maxWidth: 340, bgcolor: 'transparent' }} />
        </Box>
        <Box sx={{ p: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column' }}>
          {product.categoriaNombre && (
            <Typography variant="overline" sx={{ color: color.olive[600] }}>
              {product.categoriaNombre}
            </Typography>
          )}
          <Typography id={`vista-rapida-${product.productoID}`} variant="h3" component="h2" sx={{ mt: 0.5, pr: 4 }}>
            {titulo}
          </Typography>
          {detalle && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {detalle}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5 }}>
            <Typography className="tabular" sx={{ fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {formatCurrency(product.precio)}
            </Typography>
            <StatusChip label={status.key === 'ok' ? 'En stock' : status.label} tone={status.tone} />
          </Box>

          <Box sx={{ mt: 2.5, flex: 1 }}>
            {lead ? <CopyBlocks body={lead} /> : <Typography color="text.secondary">Pronto publicaremos la ficha completa de este producto.</Typography>}
            {benefits && (
              <Box sx={{ mt: 2 }}>
                <CopyBlocks body={benefits.body} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.25, mt: 3 }}>
            <Button onClick={() => addToCart(1)} disabled={status.key === 'out' || adding} variant="contained" size="large" startIcon={<ShoppingBagOutlinedIcon />} sx={{ flex: 1 }}>
              {status.key === 'out' ? 'Agotado' : 'Agregar al carrito'}
            </Button>
            <Button component={Link} to={`/productos/${product.productoID}`} variant="outlined" size="large" endIcon={<ArrowForwardRoundedIcon />}>
              Ver ficha
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProductQuickView;
