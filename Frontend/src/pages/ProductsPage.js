import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Box, Button, Chip, Container, Drawer, IconButton, InputAdornment, MenuItem, Slider, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import productService from '../services/productService';
import ProductCard, { ProductCardSkeleton, ProductGrid } from '../components/product/ProductCard';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/formatCurrency';
import { color, ease, radius } from '../theme/tokens';

const SORTS = [
  { value: '', label: 'Destacados' },
  { value: 'precio:asc', label: 'Precio: menor a mayor' },
  { value: 'precio:desc', label: 'Precio: mayor a menor' },
  { value: 'nombre:asc', label: 'Nombre: A a Z' },
  { value: 'nombre:desc', label: 'Nombre: Z a A' },
];

const STOCK = [
  { value: 'all', label: 'Todos' },
  { value: 'inStock', label: 'En stock' },
  { value: 'outOfStock', label: 'Agotados' },
];

const includes = (text, term) => (text || '').toLowerCase().includes(term);

const FilterGroup = ({ title, children }) => (
  <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, mb: 3.5, minWidth: 0 }}>
    <Typography component="legend" variant="overline" sx={{ p: 0, mb: 1.25, color: color.inkMuted }}>
      {title}
    </Typography>
    {children}
  </Box>
);

/** Opción de filtro tipo "radio" con apariencia de fila seleccionable. */
const OptionRow = ({ selected, onClick, children, count }) => (
  <Box
    component="button"
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      minHeight: 40,
      px: 1.5,
      border: 0,
      borderRadius: `${radius.sm}px`,
      cursor: 'pointer',
      font: 'inherit',
      fontWeight: selected ? 650 : 500,
      fontSize: '0.9375rem',
      textAlign: 'left',
      color: selected ? color.olive[700] : color.inkSoft,
      bgcolor: selected ? color.olive[100] : 'transparent',
      transition: 'background-color 160ms ease, color 160ms ease',
      '&:hover': { bgcolor: selected ? color.olive[100] : 'rgba(61, 38, 20, 0.05)', color: selected ? color.olive[700] : color.ink },
    }}
  >
    <span>{children}</span>
    {count != null && (
      <Box component="span" className="tabular" sx={{ fontSize: '0.8125rem', color: color.inkMuted, fontWeight: 500 }}>
        {count}
      </Box>
    )}
  </Box>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Búsqueda y categoría viven en la URL para poder compartir el enlace.
  const searchTerm = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('categoria') || '';

  const setParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(key, value);
      else next.delete(key);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [productsData, categoriesData] = await Promise.all([productService.getProductos(), productService.getCategorias().catch(() => [])]);
      setProducts(productsData);
      setCategories(categoriesData);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bounds = useMemo(() => {
    if (products.length === 0) return [0, 0];
    const prices = products.map((p) => p.precio);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  const range = priceRange || bounds;
  const priceActive = range[0] !== bounds[0] || range[1] !== bounds[1];

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = products.filter((product) => {
      if (term && !includes(product.nombre, term) && !includes(product.descripcion, term)) return false;
      if (selectedCategory && product.categoriaNombre !== selectedCategory) return false;
      if (product.precio < range[0] || product.precio > range[1]) return false;
      if (stockFilter === 'inStock' && product.stock <= 0) return false;
      if (stockFilter === 'outOfStock' && product.stock > 0) return false;
      return true;
    });

    if (sortOption) {
      const [key, order] = sortOption.split(':');
      const direction = order === 'asc' ? 1 : -1;
      list.sort((a, b) => (key === 'nombre' ? a.nombre.localeCompare(b.nombre, 'es') : a.precio - b.precio) * direction);
    }
    return list;
  }, [products, searchTerm, selectedCategory, range, stockFilter, sortOption]);

  const countByCategory = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.categoriaNombre] = (counts[p.categoriaNombre] || 0) + 1;
    });
    return counts;
  }, [products]);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setStockFilter('all');
    setSortOption('');
    setPriceRange(null);
  };

  const activeChips = [
    searchTerm && { key: 'q', label: `“${searchTerm}”`, onDelete: () => setParam('q', '') },
    selectedCategory && { key: 'cat', label: selectedCategory, onDelete: () => setParam('categoria', '') },
    stockFilter !== 'all' && { key: 'stock', label: STOCK.find((s) => s.value === stockFilter).label, onDelete: () => setStockFilter('all') },
    priceActive && { key: 'price', label: `${formatCurrency(range[0])} a ${formatCurrency(range[1])}`, onDelete: () => setPriceRange(null) },
  ].filter(Boolean);

  const filters = (
    <>
      <FilterGroup title="Categoría">
        <Box role="radiogroup" aria-label="Categoría" sx={{ display: 'grid', gap: 0.25 }}>
          <OptionRow selected={!selectedCategory} onClick={() => setParam('categoria', '')} count={products.length}>
            Todas
          </OptionRow>
          {categories.map((category) => (
            <OptionRow key={category.categoriaID} selected={selectedCategory === category.nombre} onClick={() => setParam('categoria', category.nombre)} count={countByCategory[category.nombre] || 0}>
              {category.nombre}
            </OptionRow>
          ))}
        </Box>
      </FilterGroup>

      <FilterGroup title="Disponibilidad">
        <Box role="radiogroup" aria-label="Disponibilidad" sx={{ display: 'grid', gap: 0.25 }}>
          {STOCK.map((option) => (
            <OptionRow key={option.value} selected={stockFilter === option.value} onClick={() => setStockFilter(option.value)}>
              {option.label}
            </OptionRow>
          ))}
        </Box>
      </FilterGroup>

      {bounds[1] > bounds[0] && (
        <FilterGroup title="Precio">
          <Box sx={{ px: 1.25 }}>
            <Slider
              value={range}
              onChange={(_event, value) => setPriceRange(value)}
              min={bounds[0]}
              max={bounds[1]}
              step={1}
              disableSwap
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatCurrency(value)}
              getAriaLabel={(i) => (i === 0 ? 'Precio mínimo' : 'Precio máximo')}
            />
            <Box className="tabular" sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: color.inkSoft }}>
              <span>{formatCurrency(range[0])}</span>
              <span>{formatCurrency(range[1])}</span>
            </Box>
          </Box>
        </FilterGroup>
      )}
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <PageHeader
        crumbs={[{ label: 'Inicio', to: '/' }]}
        current="Catálogo"
        eyebrow="Catálogo"
        title="Snacks naturales para tu mascota"
        description="Filtra por categoría o precio. Si no sabes cuál elegir, Coco te ayuda desde el botón de la esquina."
      />

      <Box sx={{ display: 'grid', gap: { md: 6 }, gridTemplateColumns: { xs: '1fr', md: '248px minmax(0, 1fr)' }, alignItems: 'start' }}>
        <Box component="aside" aria-label="Filtros" sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>
          {filters}
          {activeChips.length > 0 && (
            <Button onClick={clearFilters} variant="text" size="small" startIcon={<CloseRoundedIcon />} sx={{ ml: 0.5 }}>
              Limpiar filtros
            </Button>
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              value={searchTerm}
              onChange={(event) => setParam('q', event.target.value)}
              placeholder="Buscar por nombre o ingrediente"
              size="small"
              fullWidth
              sx={{ flex: '1 1 260px' }}
              slotProps={{
                htmlInput: { 'aria-label': 'Buscar productos', type: 'search' },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton size="small" edge="end" aria-label="Borrar búsqueda" onClick={() => setParam('q', '')}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
            <TextField select size="small" value={sortOption} onChange={(event) => setSortOption(event.target.value)} sx={{ flex: { xs: '1 1 0', sm: '0 0 228px' }, minWidth: 0 }} slotProps={{ select: { displayEmpty: true, SelectDisplayProps: { 'aria-label': 'Ordenar productos' } } }}>
              {SORTS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button onClick={() => setDrawerOpen(true)} variant="outlined" sx={{ display: { xs: 'inline-flex', md: 'none' }, flexShrink: 0, minHeight: 40 }} startIcon={<Badge color="primary" variant="dot" invisible={activeChips.length === 0}><TuneRoundedIcon fontSize="small" /></Badge>}>
              Filtros
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 3, minHeight: 32 }}>
            <Typography variant="body2" color="text.secondary" aria-live="polite" sx={{ mr: 0.5 }}>
              {status === 'ready' ? (filtered.length === 1 ? '1 producto' : `${filtered.length} productos`) : ' '}
            </Typography>
            <AnimatePresence initial={false}>
              {activeChips.map((chip) => (
                <motion.span key={chip.key} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.18 }}>
                  <Chip label={chip.label} onDelete={chip.onDelete} size="small" sx={{ bgcolor: color.olive[100], color: color.olive[700], '& .MuiChip-deleteIcon': { color: color.olive[600], '&:hover': { color: color.olive[900] } } }} />
                </motion.span>
              ))}
            </AnimatePresence>
          </Box>

          {status === 'loading' && (
            <ProductGrid>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </ProductGrid>
          )}

          {status === 'error' && (
            <EmptyState
              compact
              title="No pudimos cargar el catálogo"
              description="Puede ser un problema de conexión. Inténtalo otra vez en unos segundos."
              action={
                <Button onClick={load} variant="contained" startIcon={<RefreshRoundedIcon />}>
                  Reintentar
                </Button>
              }
            />
          )}

          {status === 'ready' && filtered.length === 0 && (
            <EmptyState
              compact
              icon={<SearchOffRoundedIcon />}
              title={products.length === 0 ? 'Aún no hay productos' : 'Sin resultados'}
              description={products.length === 0 ? 'Estamos preparando el catálogo. Vuelve pronto.' : 'Ningún producto coincide con estos filtros. Prueba con otra búsqueda o quita alguno.'}
              action={
                products.length > 0 && (
                  <Button onClick={clearFilters} variant="contained">
                    Quitar filtros
                  </Button>
                )
              }
            />
          )}

          {status === 'ready' && filtered.length > 0 && (
            <ProductGrid>
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.productoID}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: Math.min(index, 8) * 0.045, ease: ease.out } }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.16 } }}
                    transition={{ layout: { type: 'spring', stiffness: 380, damping: 34 } }}
                    style={{ height: '100%' }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ProductGrid>
          )}
        </Box>
      </Box>

      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ display: { md: 'none' } }} slotProps={{ paper: { sx: { borderRadius: '24px 24px 0 0', maxHeight: '86dvh' } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2, pb: 1 }}>
          <Typography variant="h4" component="h2">
            Filtros
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Cerrar filtros" sx={{ width: 44, height: 44 }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 2.5, pt: 1, overflowY: 'auto' }}>{filters}</Box>
        <Box sx={{ display: 'flex', gap: 1.5, p: 2.5, borderTop: `1px solid ${color.line}`, bgcolor: color.surface }}>
          <Button onClick={clearFilters} variant="outlined" sx={{ flex: 1 }} disabled={activeChips.length === 0}>
            Limpiar
          </Button>
          <Button onClick={() => setDrawerOpen(false)} variant="contained" sx={{ flex: 2 }}>
            Ver {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
