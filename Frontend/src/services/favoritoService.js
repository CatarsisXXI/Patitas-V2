import axios from 'axios';

const API_URL = 'http://localhost:5288/api/favoritos';


const getToken = () => localStorage.getItem('token');

const getFavoritos = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const getFavoritesCount = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.length;
};

const addFavorito = async (productoId) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/${productoId}`, {}, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const removeFavorito = async (productoId) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${productoId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const favoritoService = {
  getFavoritos,
  getFavoritesCount,
  addFavorito,
  removeFavorito,
};

export default favoritoService;