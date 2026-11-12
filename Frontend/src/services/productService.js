import api from '../config/api';

const getProductos = async (searchTerm = '', categoriaId = null) => {
  const params = {};
  if (searchTerm) params.searchTerm = searchTerm;
  if (categoriaId) params.categoriaId = categoriaId;
  const { data } = await api.get('/productos', { params });
  return data;
};

/** Devuelve null si el producto no existe; cualquier otro error se propaga. */
const getProductoById = async (id) => {
  try {
    const { data } = await api.get(`/productos/${id}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

const getAdminProductos = async () => {
  const { data } = await api.get('/productos', { params: { includeInactive: true } });
  return data;
};

// Los formularios de producto viajan como multipart (FormData) porque pueden incluir la imagen.
const createProducto = async (formData) => (await api.post('/productos', formData)).data;
const updateProducto = async (id, formData) => (await api.put(`/productos/${id}`, formData)).data;

/** Desactiva el producto (borrado lógico). */
const deleteProducto = async (id) => {
  await api.delete(`/productos/${id}`);
};

/** Elimina el producto de forma permanente. Solo aplica a productos inactivos. */
const forceDeleteProducto = async (id) => {
  await api.delete(`/productos/force/${id}`);
};

const getCategorias = async () => (await api.get('/productos/categorias')).data;

const productService = {
  getProductos,
  getAdminProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  forceDeleteProducto,
  getCategorias,
};

export default productService;
