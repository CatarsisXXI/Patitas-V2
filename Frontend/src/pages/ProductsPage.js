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
  Grow,
  Breadcrumbs,
  Link,
  Tooltip,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: 200,
        display: { xs: 'none', lg: 'block' },
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
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
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
  const [stockFilter, setStockFilter] = useState('all');
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
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#5D4E37',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} 
        />
        <Typography variant="h6" sx={{ color: '#5D4E37' }}>
          Cargando nuestro catálogo...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <FloatingPaws />
      
      {/* Breadcrumb Navigation */}
      <Container sx={{ py: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 0 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{ display: 'flex', alignItems: 'center', color: '#7D6B5D' }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Inicio
          </Link>
          <Typography
            sx={{ display: 'flex', alignItems: 'center', color: '#5D4E37', fontWeight: 600 }}
          >
            <StoreIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Productos
          </Typography>
        </Breadcrumbs>
      </Container>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SideImageColumn />
        <Container sx={{ py: 2, position: 'relative', flexGrow: 1, maxWidth: 'lg' }}>
          {/* Header Section */}
          <Fade in={!loading} timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 1, 
                  color: '#5D4E37',
                  fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Nuestro Catálogo
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#7D6B5D', 
                  maxWidth: '600px', 
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Descubre los mejores snacks naturales para tu mascota
              </Typography>
            </Box>
          </Fade>

          {/* Filters Section - Manteniendo la estructura original */}
          <Fade in={!loading} timeout={1200}>
            <Paper sx={{ 
              p: 2, 
              mb: 4, 
              borderRadius: 2, 
              boxShadow: 2, 
              border: '1px solid rgba(212, 165, 116, 0.2)', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(93, 78, 55, 0.15)',
              }
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3, color: '#5D4E37' }}>
                Filtros
              </Typography>
              <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Tooltip title="Busca por nombre o descripción del producto">
                    <TextField
                      fullWidth
                      label="Buscar productos"
                      variant="outlined"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#5D4E37' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ minWidth: 240 }}>
                    <InputLabel id="category-select-label" sx={{ color: '#5D4E37' }}>Categorías</InputLabel>
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
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(93, 78, 55, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#5D4E37',
                        }
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
                    <InputLabel sx={{ color: '#5D4E37' }}>Stock</InputLabel>
                    <Select
                      value={stockFilter}
                      label="Stock"
                      onChange={(e) => setStockFilter(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(93, 78, 55, 0.3)',
                        }
                      }}
                    >
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="inStock">En stock</MenuItem>
                      <MenuItem value="outOfStock">Agotados</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#5D4E37' }}>Ordenar por</InputLabel>
                    <Select
                      value={sortOption}
                      label="Ordenar por"
                      onChange={(e) => setSortOption(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <SortIcon sx={{ color: '#5D4E37' }} />
                        </InputAdornment>
                      }
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(93, 78, 55, 0.3)',
                        }
                      }}
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
                    <Typography gutterBottom sx={{ color: '#5D4E37', fontWeight: 600 }}>
                      Rango de Precio
                    </Typography>
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
                      sx={{
                        color: '#5D4E37',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#FFFFFF',
                          border: '2px solid #5D4E37',
                        },
                        '& .MuiSlider-valueLabel': {
                          backgroundColor: '#5D4E37',
                          borderRadius: '8px',
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" sx={{ color: '#5D4E37', fontWeight: 600 }}>
                        S/{priceRange[0]}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#5D4E37', fontWeight: 600 }}>
                        S/{priceRange[1]}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                  <Tooltip title="Restablecer todos los filtros">
                    <Button
                      variant="contained"
                      startIcon={<ClearIcon />}
                      onClick={handleClearFilters}
                      sx={{
                        backgroundColor: '#5D4E37',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#3D2E1F',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(93, 78, 55, 0.4)'
                        }
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Active Filters */}
          <Fade in={!loading} timeout={1400}>
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {searchTerm && (
                <Chip
                  label={`Búsqueda: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  sx={{
                    backgroundColor: 'rgba(93, 78, 55, 0.1)',
                    color: '#5D4E37',
                    border: '1px solid #5D4E37',
                    fontWeight: 600
                  }}
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Categoría: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('')}
                  sx={{
                    backgroundColor: 'rgba(93, 78, 55, 0.1)',
                    color: '#5D4E37',
                    border: '1px solid #5D4E37',
                    fontWeight: 600
                  }}
                />
              )}
              {stockFilter !== 'all' && (
                <Chip
                  label={`Stock: ${stockFilter === 'inStock' ? 'En stock' : 'Agotados'}`}
                  onDelete={() => setStockFilter('all')}
                  sx={{
                    backgroundColor: stockFilter === 'inStock' 
                      ? 'rgba(76, 175, 80, 0.1)' 
                      : 'rgba(244, 67, 54, 0.1)',
                    color: '#5D4E37',
                    border: stockFilter === 'inStock' 
                      ? '1px solid #4CAF50' 
                      : '1px solid #F44336',
                    fontWeight: 600
                  }}
                />
              )}
              {sortOption && (
                <Chip
                  label={`Orden: ${sortOption.replace(':', ' ')}`}
                  onDelete={() => setSortOption('')}
                  sx={{
                    backgroundColor: 'rgba(93, 78, 55, 0.1)',
                    color: '#5D4E37',
                    border: '1px solid #5D4E37',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
          </Fade>

          {/* Results Summary */}
          <Fade in={!loading} timeout={1600}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#5D4E37', fontWeight: 600 }}>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </Typography>
              {filteredProducts.length > 0 && (
                <Typography variant="body2" sx={{ color: '#7D6B5D' }}>
                  {filteredProducts.filter(p => p.stock > 0).length} en stock, {filteredProducts.filter(p => p.stock === 0).length} agotados
                </Typography>
              )}
            </Box>
          </Fade>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Zoom in={true}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                boxShadow: '0 8px 32px rgba(93, 78, 55, 0.08)',
                border: '1px solid rgba(93, 78, 55, 0.15)'
              }}>
                <Typography variant="h4" sx={{ color: '#5D4E37', mb: 2, fontWeight: 600 }}>
                  No se encontraron productos
                </Typography>
                <Typography variant="body1" sx={{ color: '#7D6B5D', mb: 3 }}>
                  Lo sentimos, no hay productos que coincidan con tus criterios de búsqueda.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleClearFilters}
                  sx={{
                    backgroundColor: '#5D4E37',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#3D2E1F',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(93, 78, 55, 0.4)'
                    }
                  }}
                >
                  Mostrar todos los productos
                </Button>
              </Box>
            </Zoom>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {filteredProducts.map((product, index) => (
                <Grow in={true} timeout={500 + index * 100} key={product.productoID}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <ProductCard 
                      product={product} 
                      buttonColor="#5D4E37"
                    />
                  </Grid>
                </Grow>
              ))}
            </Grid>
          )}
        </Container>
        <SideImageColumn />
      </Box>

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 1000
        }}
      >
        <Tooltip title="Ver favoritos">
          <IconButton
            sx={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#F8F6F0',
                transform: 'scale(1.1)'
              }
            }}
          >
            <FavoriteBorderIcon sx={{ color: '#5D4E37' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default ProductsPage;