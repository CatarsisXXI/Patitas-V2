import React, { useEffect, useState } from 'react';
import { Box, Button, Container, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import productService from '../services/productService';
import { assetUrl } from '../config/api';
import { whatsappUrl } from '../config/site';
import { formatCurrency } from '../utils/formatCurrency';
import { parseDescripcion, splitNombre, stockStatus } from '../lib/productCopy';
import { color, ease, radius } from '../theme/tokens';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import SmartImage from '../components/ui/SmartImage';
import StatusChip from '../components/ui/StatusChip';
import QuantityStepper from '../components/ui/QuantityStepper';
import SectionHeading from '../components/ui/SectionHeading';
import { Stagger, StaggerItem } from '../components/ui/motion';
import ProductCard, { ProductGrid } from '../components/product/ProductCard';
import { CopyBlocks, CopySection } from '../components/product/ProductCopy';
import { useProductActions } from '../components/product/useProductActions';

const DetailSkeleton = () => (
  <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
    <Skeleton width={220} height={20} sx={{ mb: 4 }} />
    <Box sx={{ display: 'grid', gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Skeleton variant="rounded" sx={{ aspectRatio: '1', height: 'auto', borderRadius: `${radius.xl}px` }} />
      <Box>
        <Skeleton width={120} height={18} />
        <Skeleton width="80%" height={56} />
        <Skeleton width="50%" height={28} />
        <Skeleton width={140} height={48} sx={{ mt: 3 }} />
        <Skeleton variant="rounded" height={52} sx={{ mt: 3, borderRadius: 999 }} />
        <Skeleton height={20} sx={{ mt: 4 }} />
        <Skeleton height={20} />
        <Skeleton width="70%" height={20} />
      </Box>
    </Box>
  </Container>
);

const ProductoDetallePage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const { addToCart, adding, favorite, toggleFav } = useProductActions(product);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setQuantity(1);
    productService
      .getProductoById(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setStatus(data ? 'ready' : 'missing');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  useEffect(() => {
    if (!product) return undefined;
    let cancelled = false;
    productService
      .getProductos()
      .then((all) => {
        if (cancelled) return;
        const others = all.filter((p) => p.productoID !== product.productoID);
        const sameCategory = others.filter((p) => p.categoriaNombre === product.categoriaNombre);
        setRelated([...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, 4));
      })
      .catch(() => setRelated([]));
    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    if (product) document.title = `${splitNombre(product.nombre).titulo} · Patitas y Sabores`;
    return () => {
      document.title = 'Patitas y Sabores · Snacks naturales para perros y gatos';
    };
  }, [product]);

  if (status === 'loading') return <DetailSkeleton />;

  if (status === 'missing' || status === 'error') {
    return (
      <EmptyState
        title={status === 'missing' ? 'No encontramos este producto' : 'No pudimos cargar el producto'}
        description={status === 'missing' ? 'Puede que ya no esté disponible. Mira el resto del catálogo.' : 'Revisa tu conexión e inténtalo otra vez.'}
        action={
          status === 'error' ? (
            <Button onClick={() => setAttempt((n) => n + 1)} variant="contained" startIcon={<RefreshRoundedIcon />}>
              Reintentar
            </Button>
          ) : (
            <Button component={Link} to="/productos" variant="contained">
              Ver catálogo
            </Button>
          )
        }
      />
    );
  }

  const { titulo, detalle } = splitNombre(product.nombre);
  const { intro, sections } = parseDescripcion(product.descripcion);
  const stock = stockStatus(product.stock);
  const soldOut = stock.key === 'out';
  const perfil = sections.find((s) => s.key === 'perfil');
  const lead = perfil?.body || intro;
  const rest = sections.filter((s) => s.key !== 'perfil');

  return (
    <>
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
        <PageHeader
          sx={{ mb: { xs: 2.5, md: 4 } }}
          crumbs={[
            { label: 'Inicio', to: '/' },
            { label: 'Catálogo', to: '/productos' },
          ]}
          current={titulo}
          title=""
        />

        <Box sx={{ display: 'grid', gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, alignItems: 'start' }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: ease.out }}
            sx={{ position: { md: 'sticky' }, top: { md: 'calc(var(--nav-h) + 24px)' } }}
          >
            <Box sx={{ position: 'relative', borderRadius: { xs: '28px', md: '40px 40px 40px 120px' }, bgcolor: color.sunken, overflow: 'hidden', '&:hover img': { transform: 'scale(1.05)' } }}>
              <SmartImage src={assetUrl(product.imagenURL)} alt={product.nombre} ratio={1} fit="contain" blend eager sx={{ bgcolor: 'transparent' }} imgSx={{ p: { xs: 3, md: 6 } }} />
              {stock.key !== 'ok' && <StatusChip label={stock.label} tone={stock.tone} sx={{ position: 'absolute', top: 20, left: 20 }} />}
            </Box>
          </Box>

          <Stagger inView={false} stagger={0.06} delay={0.1}>
            <StaggerItem>
              {product.categoriaNombre && (
                <Typography variant="overline" component="p" sx={{ color: color.olive[600], mb: 1 }}>
                  {product.categoriaNombre}
                </Typography>
              )}
              <Typography variant="h2" component="h1">
                {titulo}
              </Typography>
              {detalle && (
                <Typography sx={{ mt: 1, fontSize: '1.125rem', color: 'text.secondary' }}>{detalle}</Typography>
              )}
            </StaggerItem>

            <StaggerItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                <Typography className="tabular" sx={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {formatCurrency(product.precio)}
                </Typography>
                <StatusChip label={soldOut ? 'Agotado' : stock.key === 'low' ? `Quedan ${product.stock}` : 'En stock'} tone={stock.tone} />
              </Box>
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.75 }}>
                Precio con IGV incluido.
              </Typography>
            </StaggerItem>

            <StaggerItem>
              <Box sx={{ mt: 3.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} disabled={soldOut} />
                <Button
                  onClick={() => addToCart(quantity)}
                  disabled={soldOut || adding}
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 220px' }, order: { xs: 3, sm: 0 } }}
                >
                  {soldOut ? 'Agotado' : adding ? 'Agregando…' : 'Agregar al carrito'}
                </Button>
                <Tooltip title={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
                  <IconButton
                    onClick={toggleFav}
                    aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    aria-pressed={favorite}
                    sx={{ width: 52, height: 52, ml: { xs: 'auto', sm: 0 }, border: `1px solid ${color.lineStrong}`, color: favorite ? color.danger.main : color.inkSoft, '&:hover': { color: color.danger.main } }}
                  >
                    <motion.span key={String(favorite)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 14 }} style={{ display: 'inline-flex' }}>
                      {favorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                    </motion.span>
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                component="a"
                href={whatsappUrl(`Hola, tengo una consulta sobre ${product.nombre}.`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="text"
                size="small"
                startIcon={<WhatsAppIcon fontSize="small" />}
                sx={{ mt: 1.5, ml: -1, color: color.inkSoft }}
              >
                Consultar por WhatsApp
              </Button>
            </StaggerItem>

            {lead && (
              <StaggerItem>
                <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${color.line}`, fontSize: '1.0625rem', '& p': { fontSize: 'inherit' } }}>
                  <CopyBlocks body={lead} />
                </Box>
              </StaggerItem>
            )}

            {rest.length > 0 && (
              <StaggerItem>
                <Box sx={{ mt: 4, display: 'grid', gap: 3.5 }}>
                  {rest.map((section) => (
                    <CopySection key={section.key} section={section} />
                  ))}
                </Box>
              </StaggerItem>
            )}
          </Stagger>
        </Box>
      </Container>

      {related.length > 0 && (
        <Container maxWidth="lg" component="section" aria-labelledby="relacionados-titulo" sx={{ mt: { xs: 9, md: 14 } }}>
          <SectionHeading id="relacionados-titulo" eyebrow="Sigue mirando" title="También le puede gustar" />
          <ProductGrid>
            {related.map((item) => (
              <ProductCard key={item.productoID} product={item} />
            ))}
          </ProductGrid>
        </Container>
      )}
    </>
  );
};

export default ProductoDetallePage;
