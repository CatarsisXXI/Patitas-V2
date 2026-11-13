import React, { useState } from 'react';
import { Box, Button, Drawer, IconButton, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { assetUrl, errorMessage } from '../../config/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { splitNombre } from '../../lib/productCopy';
import { color, ease, radius, z } from '../../theme/tokens';
import QuantityStepper from '../ui/QuantityStepper';
import SmartImage from '../ui/SmartImage';
import EmptyState from '../ui/EmptyState';

/** Carrito lateral: permite revisar y ajustar el pedido sin salir de la página. */
const CartDrawer = () => {
  const { items, total, itemCount, loading, drawerOpen, closeCart, updateProductQuantity, removeProductFromCart } = useCart();
  const { notify } = useToast();
  const [busyId, setBusyId] = useState(null);

  const run = async (productoID, action) => {
    setBusyId(productoID);
    try {
      await action();
    } catch (error) {
      notify(errorMessage(error, 'No pudimos actualizar el carrito.'), { severity: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={closeCart}
      sx={{ zIndex: z.drawer }}
      slotProps={{ paper: { sx: { width: 'min(100vw, 440px)', display: 'flex', flexDirection: 'column' }, 'aria-label': 'Carrito de compras' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.25, borderBottom: `1px solid ${color.line}` }}>
        <Box>
          <Typography variant="h4" component="h2">
            Tu carrito
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {itemCount === 1 ? '1 producto' : `${itemCount} productos`}
          </Typography>
        </Box>
        <IconButton onClick={closeCart} aria-label="Cerrar carrito" sx={{ width: 44, height: 44 }}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
        {loading && items.length === 0 ? (
          <Box sx={{ pt: 3, display: 'grid', gap: 2.5 }}>
            {[0, 1].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rounded" width={76} height={76} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="80%" />
                  <Skeleton width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : items.length === 0 ? (
          <EmptyState
            compact
            icon={<ShoppingBagOutlinedIcon />}
            title="Aún está vacío"
            description="Agrega algún snack del catálogo y aparecerá aquí."
            action={
              <Button component={Link} to="/productos" onClick={closeCart} variant="contained">
                Ver catálogo
              </Button>
            }
          />
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const { titulo, detalle } = splitNombre(item.nombreProducto);
                const busy = busyId === item.productoID;
                return (
                  <Box
                    key={item.productoID}
                    component={motion.li}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.18, ease: 'easeIn' } }}
                    transition={{ duration: 0.3, ease: ease.out }}
                    sx={{ display: 'flex', gap: 2, py: 2.5, borderBottom: `1px solid ${color.line}`, opacity: busy ? 0.6 : 1 }}
                  >
                    <Box component={Link} to={`/productos/${item.productoID}`} onClick={closeCart} sx={{ flexShrink: 0 }} aria-label={`Ver ${titulo}`}>
                      <SmartImage src={assetUrl(item.imagenURL)} alt="" fit="contain" blend ratio={1} radius={radius.sm} sx={{ width: 76, bgcolor: color.sunken }} imgSx={{ p: 0.75 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 650, lineHeight: 1.3 }}>{titulo}</Typography>
                      {detalle && (
                        <Typography variant="caption" color="text.secondary" noWrap component="p">
                          {detalle}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <QuantityStepper
                          size="small"
                          value={item.cantidad}
                          disabled={busy}
                          label={`Cantidad de ${titulo}`}
                          onChange={(next) => run(item.productoID, () => updateProductQuantity(item.productoID, next))}
                        />
                        <Typography className="tabular" sx={{ fontWeight: 650 }}>
                          {formatCurrency(item.precioUnitario * item.cantidad)}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      aria-label={`Quitar ${titulo} del carrito`}
                      disabled={busy}
                      onClick={() => run(item.productoID, () => removeProductFromCart(item.productoID))}
                      sx={{ alignSelf: 'flex-start', mt: -0.5, mr: -1, width: 36, height: 36, '&:hover': { color: color.danger.main, bgcolor: color.danger.tint } }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                );
              })}
            </AnimatePresence>
          </Box>
        )}
      </Box>

      {items.length > 0 && (
        <Box sx={{ px: 3, pt: 2.5, pb: 3, borderTop: `1px solid ${color.line}`, bgcolor: color.surface }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography variant="h4" component="p" className="tabular">
              {formatCurrency(total)}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
            Precios con IGV incluido. El pedido se confirma por WhatsApp.
          </Typography>
          <Button component={Link} to="/carrito" onClick={closeCart} variant="contained" size="large" fullWidth endIcon={<ArrowForwardRoundedIcon />}>
            Revisar pedido
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
