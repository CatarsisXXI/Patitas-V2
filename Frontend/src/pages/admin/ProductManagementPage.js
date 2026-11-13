import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import productService from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { assetUrl, errorMessage } from '../../config/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { LOW_STOCK, splitNombre } from '../../lib/productCopy';
import { color, radius } from '../../theme/tokens';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SmartImage from '../../components/ui/SmartImage';
import StatusChip from '../../components/ui/StatusChip';
import Panel from '../../components/admin/Panel';
import StatTile, { StatGrid } from '../../components/admin/StatTile';

const EMPTY_FORM = { nombre: '', descripcion: '', precio: '', stock: '', categoriaID: '', activo: true, imagenURL: '' };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DELETE_WORD = 'ELIMINAR';

const productStatus = (product) => {
  if (!product.activo) return { label: 'Inactivo', tone: 'neutral' };
  if (product.stock === 0) return { label: 'Agotado', tone: 'danger' };
  if (product.stock <= LOW_STOCK) return { label: 'Stock bajo', tone: 'warning' };
  return { label: 'Disponible', tone: 'success' };
};

const validate = (form, { editing, imageOption, imageFile }) => {
  const errors = {};
  if (!form.nombre.trim()) errors.nombre = 'Escribe el nombre.';
  if (!form.descripcion.trim()) errors.descripcion = 'Escribe la descripción.';
  if (form.precio === '' || Number.isNaN(Number(form.precio)) || Number(form.precio) <= 0) errors.precio = 'Indica un precio mayor que cero.';
  if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) errors.stock = 'Indica un número entero, cero o más.';
  if (!form.categoriaID) errors.categoriaID = 'Elige una categoría.';
  // La imagen es obligatoria al crear; al editar se conserva la actual si no se cambia.
  if (!editing) {
    if (imageOption === 'file' && !imageFile) errors.image = 'Selecciona un archivo de imagen.';
    if (imageOption === 'url' && !form.imagenURL.trim()) errors.image = 'Escribe la URL de la imagen.';
  }
  return errors;
};

const ProductRow = ({ product, onEdit, onDelete }) => {
  const status = productStatus(product);
  const { titulo, detalle } = splitNombre(product.nombre);
  return (
    <Box
      component="li"
      sx={{
        display: 'grid',
        alignItems: 'center',
        columnGap: 2,
        rowGap: 1,
        gridTemplateColumns: { xs: '56px minmax(0, 1fr) auto', md: '56px minmax(0, 2.4fr) minmax(0, 1.2fr) 92px 72px 120px 96px' },
        px: 3,
        py: 1.75,
        borderTop: `1px solid ${color.line}`,
        opacity: product.activo ? 1 : 0.72,
        transition: 'background-color 140ms ease',
        '&:hover': { bgcolor: 'rgba(238, 232, 216, 0.4)' },
      }}
    >
      <SmartImage src={assetUrl(product.imagenURL)} alt="" ratio={1} fit="contain" blend radius={radius.sm} imgSx={{ p: 0.5 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 600 }} title={product.nombre}>
          {titulo}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="p">
          {detalle || product.categoriaNombre}
        </Typography>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.75 }}>
          <StatusChip size="small" tone={status.tone} label={status.label} />
          <Typography variant="caption" className="tabular" sx={{ fontWeight: 600 }}>
            {formatCurrency(product.precio)} · {product.stock} en stock
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" noWrap sx={{ display: { xs: 'none', md: 'block' } }}>
        {product.categoriaNombre}
      </Typography>
      <Typography className="tabular" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 600, textAlign: 'right' }}>
        {formatCurrency(product.precio)}
      </Typography>
      <Typography className="tabular" sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
        {product.stock}
      </Typography>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <StatusChip size="small" tone={status.tone} label={status.label} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => onEdit(product)} aria-label={`Editar ${titulo}`} sx={{ width: 40, height: 40 }}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={product.activo ? 'Desactivar' : 'Eliminar definitivamente'}>
          <IconButton
            onClick={() => onDelete(product)}
            aria-label={product.activo ? `Desactivar ${titulo}` : `Eliminar definitivamente ${titulo}`}
            sx={{ width: 40, height: 40, '&:hover': { color: color.danger.main, bgcolor: color.danger.tint } }}
          >
            {product.activo ? <VisibilityOffOutlinedIcon fontSize="small" /> : <DeleteOutlineRoundedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const ProductManagementPage = () => {
  const { notify } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageOption, setImageOption] = useState('file');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [confirm, setConfirm] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setStatus('loading');
    try {
      const [productsData, categoriesData] = await Promise.all([productService.getAdminProductos(), productService.getCategorias()]);
      setProducts(productsData);
      setCategories(categoriesData);
      setStatus('ready');
    } catch {
      if (!silent) setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      if (term && ![product.nombre, product.descripcion, product.categoriaNombre].some((value) => (value || '').toLowerCase().includes(term))) return false;
      if (statusFilter === 'active' && !product.activo) return false;
      if (statusFilter === 'inactive' && product.activo) return false;
      if (categoryFilter !== 'all' && product.categoriaNombre !== categoryFilter) return false;
      return true;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const counts = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.activo).length,
      low: products.filter((p) => p.activo && p.stock <= LOW_STOCK).length,
      inactive: products.filter((p) => !p.activo).length,
    }),
    [products]
  );

  const openDialog = (product = null) => {
    setEditing(product);
    setForm(
      product
        ? {
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precio: String(product.precio),
            stock: String(product.stock),
            categoriaID: categories.find((c) => c.nombre === product.categoriaNombre)?.categoriaID || '',
            activo: product.activo,
            imagenURL: product.imagenURL || '',
          }
        : EMPTY_FORM
    );
    setImageOption(product?.imagenURL ? 'url' : 'file');
    setImageFile(null);
    setImagePreview(product?.imagenURL ? assetUrl(product.imagenURL) : '');
    setErrors({});
    setDialogOpen(true);
  };

  const setField = (name) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'El archivo debe ser una imagen.' }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image: 'La imagen no debe superar los 5 MB.' }));
      return;
    }
    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: undefined }));
    const reader = new FileReader();
    reader.onload = (loadEvent) => setImagePreview(loadEvent.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (event) => {
    const url = event.target.value;
    setForm((prev) => ({ ...prev, imagenURL: url }));
    setImagePreview(url.trim() ? assetUrl(url) : '');
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(form, { editing, imageOption, imageFile });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = new FormData();
    data.append('nombre', form.nombre.trim());
    data.append('descripcion', form.descripcion);
    data.append('precio', parseFloat(form.precio));
    data.append('stock', parseInt(form.stock, 10));
    data.append('categoriaID', parseInt(form.categoriaID, 10));
    data.append('activo', form.activo);
    if (imageOption === 'file' && imageFile) data.append('imagenFile', imageFile);
    else if (imageOption === 'url' && form.imagenURL.trim()) data.append('imagenURL', form.imagenURL.trim());
    else if (editing?.imagenURL) data.append('imagenURL', editing.imagenURL);

    setSaving(true);
    try {
      if (editing) {
        await productService.updateProducto(editing.productoID, data);
        notify('Producto actualizado.');
      } else {
        await productService.createProducto(data);
        notify('Producto creado.');
      }
      setDialogOpen(false);
      await load(true);
    } catch (error) {
      notify(errorMessage(error, 'No pudimos guardar el producto.'), { severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const { product } = confirm;
    setDeleting(true);
    try {
      if (product.activo) {
        await productService.deleteProducto(product.productoID);
        notify('Producto desactivado. Ya no aparece en el catálogo.', { severity: 'info' });
      } else {
        await productService.forceDeleteProducto(product.productoID);
        notify('Producto eliminado definitivamente.', { severity: 'info' });
      }
      setConfirm((prev) => ({ ...prev, open: false }));
      await load(true);
    } catch (error) {
      notify(errorMessage(error, 'No pudimos completar la acción.'), { severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar los productos"
        description="Comprueba que el backend esté en marcha y vuelve a intentarlo."
        action={
          <Button onClick={() => load()} variant="contained" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const hasFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all';
  const deactivating = confirm.product?.activo;

  return (
    <>
      <PageHeader
        title="Productos"
        description="Catálogo de la tienda: precios, stock y visibilidad."
        actions={
          <Button onClick={() => openDialog()} variant="contained" startIcon={<AddRoundedIcon />}>
            Nuevo producto
          </Button>
        }
      />

      <StatGrid>
        <StatTile label="Productos" value={counts.total} loading={status === 'loading'} />
        <StatTile label="Activos" value={counts.active} loading={status === 'loading'} />
        <StatTile label="Stock bajo" value={counts.low} hint={`Con ${LOW_STOCK} unidades o menos`} loading={status === 'loading'} />
        <StatTile label="Inactivos" value={counts.inactive} loading={status === 'loading'} />
      </StatGrid>

      <Panel padded={false}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'minmax(0, 1fr) 200px 220px' }, p: 2.5 }}>
          <TextField
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre, descripción o categoría"
            size="small"
            sx={{ gridColumn: { sm: '1 / -1', md: 'auto' } }}
            slotProps={{
              htmlInput: { 'aria-label': 'Buscar productos', type: 'search' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField select size="small" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} slotProps={{ select: { SelectDisplayProps: { 'aria-label': 'Filtrar por estado' } } }}>
            <MenuItem value="all">Todos los estados</MenuItem>
            <MenuItem value="active">Activos</MenuItem>
            <MenuItem value="inactive">Inactivos</MenuItem>
          </TextField>
          <TextField select size="small" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} slotProps={{ select: { SelectDisplayProps: { 'aria-label': 'Filtrar por categoría' } } }}>
            <MenuItem value="all">Todas las categorías</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.categoriaID} value={category.nombre}>
                {category.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: '56px minmax(0, 2.4fr) minmax(0, 1.2fr) 92px 72px 120px 96px',
            columnGap: 2,
            px: 3,
            py: 1.25,
            borderTop: `1px solid ${color.line}`,
            fontSize: '0.8125rem',
            fontWeight: 650,
            color: color.inkMuted,
          }}
        >
          <span />
          <span>Producto</span>
          <span>Categoría</span>
          <Box component="span" sx={{ textAlign: 'right' }}>
            Precio
          </Box>
          <Box component="span" sx={{ textAlign: 'right' }}>
            Stock
          </Box>
          <span>Estado</span>
          <span />
        </Box>

        {status === 'loading' ? (
          <Box sx={{ px: 3, pb: 2 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={64} />
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState
            compact
            icon={<Inventory2OutlinedIcon />}
            title={hasFilters ? 'Sin resultados' : 'Aún no hay productos'}
            description={hasFilters ? 'Prueba con otra búsqueda o cambia los filtros.' : 'Crea el primer producto del catálogo.'}
            action={
              !hasFilters && (
                <Button onClick={() => openDialog()} variant="contained" startIcon={<AddRoundedIcon />}>
                  Nuevo producto
                </Button>
              )
            }
          />
        ) : (
          <Box component="ul" aria-label="Productos" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {filtered.map((product) => (
              <ProductRow key={product.productoID} product={product} onEdit={openDialog} onDelete={(item) => setConfirm({ open: true, product: item })} />
            ))}
          </Box>
        )}
      </Panel>

      <Dialog open={dialogOpen} onClose={saving ? undefined : () => setDialogOpen(false)} maxWidth="md" fullWidth aria-labelledby="producto-titulo">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2.5, sm: 4 }, pt: 3, pb: 1 }}>
            <Typography id="producto-titulo" variant="h2">
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)} disabled={saving} aria-label="Cerrar" sx={{ width: 44, height: 44, mr: -1 }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 2.5, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr)' }, alignItems: 'start' }}>
            <Box>
              <SmartImage src={imagePreview} alt="Vista previa de la imagen" ratio={1} fit="contain" blend radius={radius.md} imgSx={{ p: 1.5 }} sx={{ border: errors.image ? `1.5px solid ${color.danger.main}` : 'none' }} />
              <ToggleButtonGroup
                exclusive
                fullWidth
                size="small"
                value={imageOption}
                onChange={(_event, value) => value && setImageOption(value)}
                aria-label="Origen de la imagen"
                sx={{ mt: 1.5, '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, borderColor: color.lineStrong, '&.Mui-selected': { bgcolor: color.olive[100], color: color.olive[700] } } }}
              >
                <ToggleButton value="file">Archivo</ToggleButton>
                <ToggleButton value="url">URL</ToggleButton>
              </ToggleButtonGroup>

              {imageOption === 'file' ? (
                <Button component="label" variant="outlined" fullWidth startIcon={<CloudUploadOutlinedIcon />} sx={{ mt: 1.5 }}>
                  {imageFile ? 'Cambiar archivo' : 'Elegir archivo'}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              ) : (
                <TextField value={form.imagenURL} onChange={handleImageUrl} label="URL de la imagen" size="small" fullWidth sx={{ mt: 1.5 }} placeholder="https://… o /images/products/…" />
              )}
              <Typography variant="caption" component="p" role={errors.image ? 'alert' : undefined} sx={{ mt: 1, color: errors.image ? color.danger.main : color.inkMuted }}>
                {errors.image || (imageFile ? `${imageFile.name} · ${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG o PNG, hasta 5 MB.')}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <TextField label="Nombre" value={form.nombre} onChange={setField('nombre')} error={!!errors.nombre} helperText={errors.nombre || 'Si pones los ingredientes entre paréntesis, se muestran como subtítulo.'} required fullWidth autoFocus />
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr 1fr' } }}>
                <TextField select label="Categoría" value={form.categoriaID} onChange={setField('categoriaID')} error={!!errors.categoriaID} helperText={errors.categoriaID || ' '} required fullWidth>
                  {categories.map((category) => (
                    <MenuItem key={category.categoriaID} value={category.categoriaID}>
                      {category.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Precio"
                  type="number"
                  value={form.precio}
                  onChange={setField('precio')}
                  error={!!errors.precio}
                  helperText={errors.precio || ' '}
                  required
                  fullWidth
                  slotProps={{ htmlInput: { min: 0, step: '0.10', inputMode: 'decimal' }, input: { startAdornment: <InputAdornment position="start">S/</InputAdornment> } }}
                />
                <TextField label="Stock" type="number" value={form.stock} onChange={setField('stock')} error={!!errors.stock} helperText={errors.stock || ' '} required fullWidth slotProps={{ htmlInput: { min: 0, step: 1, inputMode: 'numeric' } }} />
              </Box>
              <TextField
                label="Descripción"
                value={form.descripcion}
                onChange={setField('descripcion')}
                error={!!errors.descripcion}
                helperText={errors.descripcion || 'Usa los títulos "Perfil del producto:", "Composición funcional:", "Beneficios principales:", "Recomendado para:" y "Evitar en:" para que la ficha se muestre por secciones.'}
                required
                fullWidth
                multiline
                minRows={6}
                maxRows={14}
              />
              <FormControlLabel control={<Switch checked={form.activo} onChange={setField('activo')} />} label={form.activo ? 'Visible en el catálogo' : 'Oculto del catálogo'} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: { xs: 2.5, sm: 4 }, py: 2.5, borderTop: `1px solid ${color.line}` }}>
            <Button onClick={() => setDialogOpen(false)} disabled={saving} variant="text">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>
              {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        title={deactivating ? `¿Desactivar ${splitNombre(confirm.product?.nombre).titulo}?` : `¿Eliminar ${splitNombre(confirm.product?.nombre).titulo}?`}
        description={
          deactivating
            ? 'Dejará de verse en el catálogo, pero conservas sus datos y puedes reactivarlo cuando quieras.'
            : 'Se borrará de forma permanente y no se puede deshacer.'
        }
        confirmLabel={deactivating ? 'Desactivar' : 'Eliminar definitivamente'}
        requireText={deactivating ? undefined : DELETE_WORD}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirm((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default ProductManagementPage;
