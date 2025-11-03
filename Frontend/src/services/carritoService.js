import axios from 'axios';

const API_URL = 'http://localhost:5288/api/Carrito';

// Helper to get the token from localStorage
const getToken = () => localStorage.getItem('userToken');

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

const getCarrito = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

const addItemAlCarrito = async (productoId, cantidad) => {
  const response = await axios.post(`${API_URL}/items`, { productoId, cantidad }, getAuthHeaders());
  return response.data;
};

const removeItemDelCarrito = async (productoId) => {
  const response = await axios.delete(`${API_URL}/items/${productoId}`, getAuthHeaders());
  return response.data;
};

const vaciarCarrito = async () => {
  await axios.delete(API_URL, getAuthHeaders());
};

const carritoService = {
  getCarrito,
  addItemAlCarrito,
  removeItemDelCarrito,
  vaciarCarrito,
};

export default carritoService;