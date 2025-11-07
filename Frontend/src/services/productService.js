import axios from 'axios';

// The base URL of our .NET backend API
// We'll likely need to configure CORS on the backend to allow requests from our frontend
const API_URL = 'http://localhost:5288/api/productos'; // Adjust port if necessary

// Helper to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to get authorized headers
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const getProductos = async (searchTerm = '', categoriaId = null) => {
  try {
    const params = {};
    if (searchTerm) params.searchTerm = searchTerm;
    if (categoriaId) params.categoriaId = categoriaId;
    const config = {
      params,
      ...getAuthHeaders()
    };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching productos:", error);
    // Log additional error details to help with debugging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return [];
  }
};

const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching producto with id ${id}:`, error);
    return null;
  }
};

const getAdminProductos = async () => {
  try {
    const config = {
      params: { includeInactive: true },
      ...getAuthHeaders()
    };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching products for admin:", error);
    throw error;
  }
};

const createProducto = async (formData) => {

  try {
    // Axios will automatically set the 'Content-Type' to 'multipart/form-data'
    // when you pass a FormData object.
    const response = await axios.post(API_URL, formData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating producto:", error);
    throw error;
  }
};


const updateProducto = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error updating producto with id ${id}:`, error);
    throw error;
  }
};


const deleteProducto = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error(`Error deleting producto with id ${id}:`, error);
    throw error;
  }
};

const forceDeleteProducto = async (id) => {
  try {
    await axios.delete(`${API_URL}/force/${id}`, getAuthHeaders());
  } catch (error) {
    console.error(`Error force deleting producto with id ${id}:`, error);
    throw error;
  }
};

const getCategorias = async () => {
  try {
    // This now correctly points to the new endpoint in ProductosController
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

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