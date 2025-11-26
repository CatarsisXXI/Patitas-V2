import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Fab,
  Grid,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  alpha,
  useTheme,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Numbers as NumbersIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import productService from '../../services/productService';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaID: '',
    activo: true,
    imagenURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageOption, setImageOption] = useState('file');
  const [imagePreview, setImagePreview] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const theme = useTheme();

  // Paleta de colores profesional
  const colors = {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b'
  };

  // Función para construir la URL completa de la imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Si ya es una URL completa, retornarla
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta local del servidor, construir la URL completa
    if (imagePath.startsWith('/')) {
      return `${window.location.origin}${imagePath}`;
    }
    
    // Si es un nombre de archivo, asumir que está en la carpeta de productos
    return `${window.location.origin}/images/products/${imagePath}`;
  };

  const showAlert = useCallback((message, severity = 'success') => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAdminProductos();
      // Procesar las URLs de imagen para mostrar correctamente
      const processedData = data.map(product => ({
        ...product,
        imagenURL: getImageUrl(product.imagenURL)
      }));
      setProducts(processedData);
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await productService.getCategorias();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showAlert('Error al cargar las categorías', 'error');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const filterProducts = () => {
    let filtered = products;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => 
        statusFilter === 'active' ? product.activo : !product.activo
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.categoriaNombre === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  };

  const getStatusCount = (status) => {
    if (status === 'active') {
      return products.filter(product => product.activo).length;
    } else if (status === 'inactive') {
      return products.filter(product => !product.activo).length;
    }
    return products.length;
  };

  const getStockStatus = (product) => {
    if (!product.activo) return { label: 'Inactivo', color: colors.error };
    if (product.stock === 0) return { label: 'Agotado', color: colors.error };
    if (product.stock <= 10) return { label: 'Bajo Stock', color: colors.warning };
    return { label: 'Disponible', color: colors.success };
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        categoriaID: categories.find(c => c.nombre === product.categoriaNombre)?.categoriaID || '',
        activo: product.activo,
        imagenURL: product.imagenURL || ''
      });
      setImagePreview(product.imagenURL || '');
      // Determinar la opción de imagen basada en si ya tiene imagen
      setImageOption(product.imagenURL ? 'url' : 'file');
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoriaID: '',
        activo: true,
        imagenURL: ''
      });
      setImagePreview('');
      setImageOption('file');
    }
    setImageFile(null);
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaID: '',
      activo: true,
      imagenURL: ''
    });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({});
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showAlert('Por favor selecciona un archivo de imagen válido', 'error');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('La imagen no debe exceder los 5MB', 'error');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Limpiar error de imagen si existe
      setFormErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, imagenURL: url }));
    setImagePreview(url);
    
    // Limpiar error de imagen si existe
    if (url.trim()) {
      setFormErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) errors.descripcion = 'La descripción es requerida';
    if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser un número positivo';
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser un número no negativo';
    }
    if (!formData.categoriaID) errors.categoriaID = 'La categoría es requerida';

    // Validar imagen basada en la opción seleccionada
    if (!editingProduct) {
      // Para productos nuevos, la imagen es obligatoria
      if (imageOption === 'file' && !imageFile) {
        errors.image = 'Debes seleccionar un archivo de imagen.';
      } else if (imageOption === 'url' && !formData.imagenURL.trim()) {
        errors.image = 'Debes ingresar una URL de imagen.';
      }
    } else {
      // Para edición, la imagen es opcional (puede mantener la actual)
      if (imageOption === 'file' && !imageFile && !imagePreview) {
        errors.image = 'Debes seleccionar un archivo de imagen o mantener la actual.';
      } else if (imageOption === 'url' && !formData.imagenURL.trim() && !imagePreview) {
        errors.image = 'Debes ingresar una URL de imagen o mantener la actual.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      const productFormData = new FormData();
      productFormData.append('nombre', formData.nombre);
      productFormData.append('descripcion', formData.descripcion);
      productFormData.append('precio', parseFloat(formData.precio));
      productFormData.append('stock', parseInt(formData.stock));
      productFormData.append('categoriaID', parseInt(formData.categoriaID));
      productFormData.append('activo', formData.activo);

      // Manejar la imagen según la opción seleccionada
      if (imageOption === 'file' && imageFile) {
        productFormData.append('imagenFile', imageFile);
      } else if (imageOption === 'url' && formData.imagenURL.trim()) {
        productFormData.append('imagenURL', formData.imagenURL);
      } else if (editingProduct && !imageFile && !formData.imagenURL.trim()) {
        // Si está editando y no cambió la imagen, mantener la actual
        productFormData.append('imagenURL', editingProduct.imagenURL);
      }

      if (editingProduct) {
        await productService.updateProducto(editingProduct.productoID, productFormData);
        showAlert('Producto actualizado exitosamente');
      } else {
        await productService.createProducto(productFormData);
        showAlert('Producto creado exitosamente');
      }

      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showAlert('Error al guardar el producto', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (product.activo) {
      // Soft delete (disable) for active products
      if (!window.confirm(`¿Estás seguro de que quieres DESACTIVAR el producto "${product.nombre}"? No será visible para los clientes.`)) return;
      try {
        await productService.deleteProducto(product.productoID);
        showAlert('Producto desactivado exitosamente');
        fetchProducts();
      } catch (error) {
        console.error('Error deactivating product:', error);
        showAlert('Error al desactivar el producto', 'error');
      }
    } else {
      // Hard delete for inactive products
      const confirmationText = 'ELIMINAR';
      const userInput = window.prompt(`¡ACCIÓN PERMANENTE! Esta acción no se puede deshacer. Para eliminar definitivamente el producto "${product.nombre}", escribe "${confirmationText}" en el campo.`);

      if (userInput === confirmationText) {
        try {
          await productService.forceDeleteProducto(product.productoID);
          showAlert('Producto eliminado permanentemente');
          fetchProducts();
        } catch (error) {
          console.error('Error force deleting product:', error);
          showAlert('Error al eliminar el producto permanentemente', 'error');
        }
      } else if (userInput !== null) {
        showAlert('La confirmación no coincide. El producto no ha sido eliminado.', 'warning');
      }
    }
  };

  const ProductCard = ({ product }) => {
    const status = getStockStatus(product);
    
    return (
      <Card 
        sx={{ 
          mb: 2,
          border: `1px solid ${alpha(colors.primary, 0.1)}`,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Imagen del producto */}
            <Grid item xs={12} sm={2}>
              <Avatar
                src={product.imagenURL}
                variant="rounded"
                sx={{ 
                  width: 80, 
                  height: 80,
                  border: `2px solid ${alpha(colors.primary, 0.2)}`
                }}
              >
                <InventoryIcon />
              </Avatar>
            </Grid>

            {/* Información del producto */}
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {product.nombre}
              </Typography>
              <Typography variant="body2" color={colors.textLight} sx={{ mb: 1 }}>
                {product.descripcion.length > 80 
                  ? `${product.descripcion.substring(0, 80)}...` 
                  : product.descripcion
                }
              </Typography>
              <Chip 
                label={product.categoriaNombre}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              />
            </Grid>

            {/* Precio y stock */}
            <Grid item xs={6} sm={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MoneyIcon sx={{ color: colors.primary, fontSize: 20 }} />
                <Typography variant="h6" color={colors.primary}>
                  S/ {product.precio.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NumbersIcon sx={{ color: colors.textLight, fontSize: 18 }} />
                <Typography variant="body2" color={colors.textLight}>
                  Stock: {product.stock}
                </Typography>
              </Box>
            </Grid>

            {/* Estado */}
            <Grid item xs={6} sm={2}>
              <Chip
                label={status.label}
                size="small"
                sx={{
                  backgroundColor: status.color,
                  color: 'white',
                  fontWeight: '600'
                }}
              />
            </Grid>

            {/* Acciones */}
            <Grid item xs={12} sm={2}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Tooltip title="Editar producto">
                  <IconButton
                    onClick={() => handleOpenDialog(product)}
                    sx={{ 
                      border: `1px solid ${alpha(colors.primary, 0.2)}`,
                      borderRadius: 2
                    }}
                  >
                    <EditIcon sx={{ color: colors.primary }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={product.activo ? "Desactivar producto" : "Eliminar permanentemente"}>
                  <IconButton
                    onClick={() => handleDelete(product)}
                    sx={{ 
                      border: `1px solid ${alpha(colors.error, 0.2)}`,
                      borderRadius: 2
                    }}
                  >
                    <DeleteIcon sx={{ color: colors.error }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color={colors.textLight}>
          Cargando productos...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="800" 
          gutterBottom
          sx={{ color: colors.text }}
        >
          Gestión de Productos
        </Typography>
        <Typography variant="h6" color={colors.textLight}>
          Administra el catálogo de productos de tu tienda
        </Typography>
      </Box>

      {/* Alertas */}
      {alert && (
        <Alert 
          severity={alert.severity} 
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            border: `1px solid ${colors[alert.severity]}`
          }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Estadísticas rápidas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.primary, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.primary}>
                {products.length}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Total Productos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.success, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.success}>
                {getStatusCount('active')}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.warning, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.warning}>
                {products.filter(p => p.stock <= 10 && p.activo).length}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Bajo Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ borderRadius: 3, bgcolor: alpha(colors.error, 0.05) }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={colors.error}>
                {getStatusCount('inactive')}
              </Typography>
              <Typography variant="body2" color={colors.textLight}>
                Inactivos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="all">Todas las categorías</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.categoriaID} value={category.nombre}>
                    {category.nombre}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  borderRadius: 3,
                  height: '56px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                }}
              >
                Nuevo
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
          <CardContent>
            <InventoryIcon sx={{ fontSize: 80, color: colors.textLight, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color={colors.textLight} gutterBottom>
              No se encontraron productos
            </Typography>
            <Typography variant="body2" color={colors.textLight}>
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Intenta con otros términos de búsqueda' 
                : 'No hay productos registrados'
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {filteredProducts.map((product) => (
            <ProductCard key={product.productoID} product={product} />
          ))}
        </Box>
      )}

      {/* Diálogo de producto */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: 'white'
        }}>
          <Typography variant="h5" fontWeight="600">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {/* Previsualización de imagen */}
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src={imagePreview}
                    variant="rounded"
                    sx={{ 
                      width: 120, 
                      height: 120,
                      mx: 'auto',
                      border: `2px solid ${alpha(colors.primary, 0.2)}`,
                      mb: 2
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 40, color: colors.textLight }} />
                  </Avatar>
                  <Typography variant="body2" color={colors.textLight}>
                    {imagePreview ? 'Vista previa de la imagen' : 'Sin imagen seleccionada'}
                  </Typography>
                </Box>
              </Grid>

              {/* Campos del formulario */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  error={!!formErrors.nombre}
                  helperText={formErrors.nombre}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.categoriaID}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoriaID}
                    label="Categoría"
                    onChange={(e) => setFormData({ ...formData, categoriaID: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoriaID} value={category.categoriaID}>
                        {category.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.categoriaID && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {formErrors.categoriaID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  error={!!formErrors.precio}
                  helperText={formErrors.precio}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: colors.textLight }}>S/</Typography>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Disponible"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  error={!!formErrors.stock}
                  helperText={formErrors.stock}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  error={!!formErrors.descripcion}
                  helperText={formErrors.descripcion}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Opciones de imagen */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
                  Imagen del Producto
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant={imageOption === 'file' ? 'contained' : 'outlined'}
                    startIcon={<CloudUploadIcon />}
                    onClick={() => setImageOption('file')}
                    sx={{ borderRadius: 2 }}
                  >
                    Subir Archivo
                  </Button>
                  <Button
                    variant={imageOption === 'url' ? 'contained' : 'outlined'}
                    startIcon={<LinkIcon />}
                    onClick={() => setImageOption('url')}
                    sx={{ borderRadius: 2 }}
                  >
                    URL de Imagen
                  </Button>
                </Box>

                {imageOption === 'file' ? (
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{ borderRadius: 2, mb: 2 }}
                    >
                      Seleccionar Archivo de Imagen
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {imageFile && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color={colors.success}>
                          Archivo seleccionado: {imageFile.name}
                        </Typography>
                        <Chip 
                          label={`${(imageFile.size / 1024 / 1024).toFixed(2)} MB`} 
                          size="small" 
                          color="primary" 
                        />
                      </Box>
                    )}
                    <Typography variant="caption" color={colors.textLight} sx={{ mt: 1, display: 'block' }}>
                      Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    label="URL de la Imagen"
                    value={formData.imagenURL}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg o /images/products/mi-imagen.jpg"
                    helperText="Ingresa una URL completa o ruta local del servidor"
                    error={!!formErrors.image}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                )}

                {formErrors.image && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {formErrors.image}
                  </Typography>
                )}
              </Grid>

              {/* Estado del producto */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.activo ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />}
                      <Typography>
                        Producto {formData.activo ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitLoading}
            sx={{ 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
            }}
          >
            {submitLoading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              editingProduct ? 'Actualizar Producto' : 'Crear Producto'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botón flotante para móvil */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ProductManagementPage;