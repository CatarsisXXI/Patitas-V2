import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SectionHeading from '../../components/ui/SectionHeading';
import { Stagger, StaggerItem } from '../../components/ui/motion';
import ProductCard, { ProductCardSkeleton, ProductGrid } from '../../components/product/ProductCard';
import { color, radius } from '../../theme/tokens';

const FeaturedProducts = ({ products, status, onRetry }) => (
  <Box component="section" aria-labelledby="destacados-titulo" sx={{ py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <SectionHeading
        id="destacados-titulo"
        eyebrow="De nuestra cocina"
        title="Recetas pensadas para cada necesidad"
        description="Cada snack tiene una función: digestión, piel y pelaje, energía o control de peso."
        action={
          <Button component={Link} to="/productos" variant="outlined" endIcon={<ArrowForwardRoundedIcon />}>
            Ver todo el catálogo
          </Button>
        }
      />

      {status === 'loading' && (
        <ProductGrid>
          {[0, 1, 2, 3].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      )}

      {status === 'error' && (
        <Box sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', borderRadius: `${radius.lg}px`, border: `1px dashed ${color.lineStrong}` }}>
          <Typography variant="h5" component="p">
            No pudimos cargar los productos.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
            Revisa tu conexión e inténtalo otra vez.
          </Typography>
          <Button onClick={onRetry} variant="outlined" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        </Box>
      )}

      {status === 'ready' && products.length > 0 && (
        <Stagger as="div">
          <ProductGrid>
            {products.map((product) => (
              <StaggerItem key={product.productoID} style={{ height: '100%' }}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </ProductGrid>
        </Stagger>
      )}

      {status === 'ready' && products.length === 0 && (
        <Typography color="text.secondary">Pronto publicaremos nuestros primeros productos.</Typography>
      )}
    </Container>
  </Box>
);

export default FeaturedProducts;
