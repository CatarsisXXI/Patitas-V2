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
  Switch
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import productService from '../../services/productService';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaID: '',
    activo: true,
    imagenURL: '' // State for image URL
  });
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [imageOption, setImageOption] = useState('file'); // 'file' or 'url'
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message, severity = 'success') => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAdminProductos();
      setProducts(data);
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

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        categoriaID: categories.find(c => c.nombre === product.categoriaNombre)?.categoriaID || '',
        activo: product.activo
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoriaID: '',
        activo: true
      });
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
      activo: true
    });
    setImageFile(null);
    setFormErrors({});
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
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

    // Validate image based on option selected
    if (!editingProduct) {
      if (imageOption === 'file' && !imageFile) {
        errors.image = 'Debes seleccionar un archivo de imagen.';
      } else if (imageOption === 'url' && !formData.imagenURL.trim()) {
        errors.image = 'Debes ingresar una URL de imagen.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);

    const productFormData = new FormData();
    productFormData.append('nombre', formData.nombre);
    productFormData.append('descripcion', formData.descripcion);
    productFormData.append('precio', parseFloat(formData.precio));
    productFormData.append('stock', parseInt(formData.stock));
    productFormData.append('categoriaID', parseInt(formData.categoriaID));
    productFormData.append('activo', formData.activo);

    if (imageOption === 'file' && imageFile) {
        productFormData.append('imagenFile', imageFile);
    } else if (imageOption === 'url' && formData.imagenURL) {
        productFormData.append('imagenURL', formData.imagenURL);
    }

    try {
      if (editingProduct) {
        // If updating, we might not have a new image. The backend should handle this.
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
      } else if (userInput !== null) { // User typed something but it was wrong or cancelled
        showAlert('La confirmación no coincide. El producto no ha sido eliminado.', 'warning');
      }
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Productos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Producto
        </Button>
      </Box>

      {alert && (
        <Alert severity={alert.severity} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productoID}>
                <TableCell>{product.productoID}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.categoriaNombre}</TableCell>
                <TableCell>S/ {product.precio.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                <Chip
                    label={product.activo ? (product.stock > 0 ? 'Activo' : 'Agotado') : 'Inactivo'}
                    color={product.activo ? (product.stock > 0 ? 'success' : 'warning') : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product)}
                  >
                    <DeleteIcon />
                  </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  error={!!formErrors.nombre}
                  helperText={formErrors.nombre}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.categoriaID}>
                  <InputLabel id="categoria-select-label">Categoría</InputLabel>
                  <Select
                    labelId="categoria-select-label"
                    value={formData.categoriaID}
                    label="Categoría"
                    onChange={(e) => setFormData({ ...formData, categoriaID: e.target.value })}
                    sx={{ minHeight: '56px' }} // Make it taller for better visibility
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoriaID} value={category.categoriaID}>
                        {category.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.categoriaID && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
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
                    startAdornment: <Typography sx={{ mr: 1 }}>S/</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  error={!!formErrors.stock}
                  helperText={formErrors.stock}
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
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" gutterBottom>
                    Opción de Imagen
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant={imageOption === 'file' ? 'contained' : 'outlined'}
                      onClick={() => setImageOption('file')}
                    >
                      Subir Archivo
                    </Button>
                    <Button
                      variant={imageOption === 'url' ? 'contained' : 'outlined'}
                      onClick={() => setImageOption('url')}
                    >
                      URL de Imagen
                    </Button>
                  </Box>

                  {imageOption === 'file' ? (
                    <Box>
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                      >
                        Seleccionar Archivo de Imagen
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {imageFile && <Typography sx={{ mt: 1 }}>{imageFile.name}</Typography>}
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      label="URL de la Imagen"
                      value={formData.imagenURL}
                      onChange={(e) => setFormData({ ...formData, imagenURL: e.target.value })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      helperText="Ingresa la URL completa de la imagen"
                    />
                  )}

                  {formErrors.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {formErrors.image}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Producto Activo"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={20} /> : (editingProduct ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ProductManagementPage;