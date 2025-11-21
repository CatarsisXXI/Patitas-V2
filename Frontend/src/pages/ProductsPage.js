import React, { useState, useEffect } from 'react';
import {
 Grid,
 Typography,
 Container,
 CircularProgress,
 Box,
 TextField,
 FormControl,
 InputLabel,
 Select,
 MenuItem,
 Paper,
 Button,
 Chip,
 Slider,
 InputAdornment,
 Fade,
 Zoom,
 Grow
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import FloatingPaws from '../components/FloatingPaws';

const sideImages = [
  'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/4587959/pexels-photo-4587959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/4588048/pexels-photo-4588048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/3761597/pexels-photo-3761597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
];

const SideImageColumn = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sideImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: 200,
        display: { xs: 'none', lg: 'block' }, // Hide on small screens
        position: 'relative',
        mt: '100px',
        mx: 2,
        height: 250,
      }}
    >
      {sideImages.map((image, index) => (
        <Fade in={index === currentImageIndex} timeout={1000} key={image}>
          <Box
            component="img"
            src={image}
            alt="Mascotas felices"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: 3,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </Fade>
      ))}
    </Box>
  );
};

const ProductsPage = () => {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'outOfStock'
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProductos(),
          productService.getCategorias()
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);

        if (productsData.length > 0) {
          const prices = productsData.map(p => p.precio);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoriaNombre === selectedCategory);
    }

    filtered = filtered.filter(product =>
      product.precio >= priceRange[0] && product.precio <= priceRange[1]
    );

    if (stockFilter === 'inStock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(product => product.stock === 0);
    }

    if (sortOption) {
      const [key, order] = sortOption.split(':');
      filtered.sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, stockFilter, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setStockFilter('all');
    setSortOption('');
    if (products.length > 0) {
      const prices = products.map(p => p.precio);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <FloatingPaws />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SideImageColumn />
        <Container sx={{ py: 4, position: 'relative', flexGrow: 1, maxWidth: 'lg' }}>
          <Fade in={!loading} timeout={1000}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4, color: 'primary.main' }}>
              Nuestro Catálogo
            </Typography>
          </Fade>

          {/* Filters Section */}
          <Paper sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 2, border: '1px solid rgba(212, 165, 116, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
              Filtros
            </Typography>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Buscar productos"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth sx={{ minWidth: 240 }}>
                  <InputLabel id="category-select-label">Categorías</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategory}
                    label="Categorías"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Todas las categorías</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.categoriaID} value={category.nombre}>
                        {category.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Stock</InputLabel>
                  <Select
                    value={stockFilter}
                    label="Stock"
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="inStock">En stock</MenuItem>
                    <MenuItem value="outOfStock">Agotados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={sortOption}
                    label="Ordenar por"
                    onChange={(e) => setSortOption(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>Por defecto</em>
                    </MenuItem>
                    <MenuItem value="precio:asc">Precio: Menor a Mayor</MenuItem>
                    <MenuItem value="precio:desc">Precio: Mayor a Menor</MenuItem>
                    <MenuItem value="nombre:asc">Nombre: A-Z</MenuItem>
                    <MenuItem value="nombre:desc">Nombre: Z-A</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Rango de Precio</Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    step={10}
                    marks={[
                      { value: 0, label: 'S/0' },
                      { value: 500, label: 'S/500' },
                      { value: 1000, label: 'S/1000' },
                    ]}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">S/{priceRange[0]}</Typography>
                    <Typography variant="body2">S/{priceRange[1]}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                >
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Active Filters */}
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {searchTerm && (
              <Chip
                label={`Búsqueda: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Categoría: ${selectedCategory}`}
                onDelete={() => setSelectedCategory('')}
                color="primary"
                variant="outlined"
              />
            )}
            {stockFilter !== 'all' && (
              <Chip
                label={`Stock: ${stockFilter === 'inStock' ? 'En stock' : 'Agotados'}`}
                onDelete={() => setStockFilter('all')}
                color="primary"
                variant="outlined"
              />
            )}
            {sortOption && (
              <Chip
                label={`Orden: ${sortOption.replace(':', ' ')}`}
                onDelete={() => setSortOption('')}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>

          {/* Results Summary */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </Typography>
            {filteredProducts.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.filter(p => p.stock > 0).length} en stock, {filteredProducts.filter(p => p.stock === 0).length} agotados
              </Typography>
            )}
          </Box>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Zoom in={true}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary">
                  No se encontraron productos que coincidan con los filtros.
                </Typography>
                <Button variant="contained" onClick={handleClearFilters} sx={{ mt: 2 }}>
                  Limpiar filtros
                </Button>
              </Box>
            </Zoom>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {filteredProducts.map((product, index) => (
                <Grow in={true} timeout={500 + index * 100} key={product.productoID}>
                  <Grid item xs={12} sm={6} md={4}>
                    <ProductCard product={product} />
                  </Grid>
                </Grow>
              ))}
            </Grid>
          )}
        </Container>
        <SideImageColumn />
      </Box>
    </Box>
  );

};

export default ProductsPage;