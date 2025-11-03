import axios from 'axios';

const API_URL = 'http://localhost:5288/api/mascotas';

const getToken = () => localStorage.getItem('token');

const getMascotas = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const getMascota = async (id) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const createMascota = async (mascota) => {
  const token = getToken();
  const response = await axios.post(API_URL, mascota, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const updateMascota = async (id, mascota) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/${id}`, mascota, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const deleteMascota = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const mascotaService = {
  getMascotas,
  getMascota,
  createMascota,
  updateMascota,
  deleteMascota,
};

export default mascotaService;