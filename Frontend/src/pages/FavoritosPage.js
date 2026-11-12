import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import favoritoService from '../services/favoritoService';
import { useFavorites } from '../context/FavoritesContext';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ProductCard, { ProductCardSkeleton, ProductGrid } from '../components/product/ProductCard';
import { ease } from '../theme/tokens';

const FavoritosPage = () => {
  const { isFavorite } = useFavorites();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    favoritoService
      .getFavoritos()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Al quitar un favorito desde la tarjeta, desaparece de la lista sin recargar.
  const visible = products.filter((product) => isFavorite(product.productoID));

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar tus favoritos"
        description="Revisa tu conexión e inténtalo otra vez."
        action={
          <Button onClick={() => setAttempt((n) => n + 1)} variant="contained" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  if (status === 'ready' && visible.length === 0) {
    return (
      <EmptyState
        icon={<FavoriteBorderRoundedIcon />}
        title="Todavía no guardas favoritos"
        description="Toca el corazón de cualquier producto y lo tendrás aquí para la próxima compra."
        action={
          <Button component={Link} to="/productos" variant="contained" size="large">
            Ver catálogo
          </Button>
        }
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <PageHeader
        crumbs={[{ label: 'Inicio', to: '/' }]}
        current="Favoritos"
        eyebrow="Tu cuenta"
        title="Favoritos"
        description={status === 'ready' ? (visible.length === 1 ? '1 producto guardado.' : `${visible.length} productos guardados.`) : 'Cargando tus productos guardados.'}
        actions={
          <Button component={Link} to="/productos" variant="outlined">
            Seguir explorando
          </Button>
        }
      />

      <ProductGrid>
        {status === 'loading' && [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        <AnimatePresence mode="popLayout">
          {status === 'ready' &&
            visible.map((product, index) => (
              <motion.div
                key={product.productoID}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: index * 0.05, ease: ease.out } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                style={{ height: '100%' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
        </AnimatePresence>
      </ProductGrid>
    </Container>
  );
};

export default FavoritosPage;
