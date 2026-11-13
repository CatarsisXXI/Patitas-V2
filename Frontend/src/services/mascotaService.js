import api from '../config/api';

const getMascotas = async () => (await api.get('/mascotas')).data;
const getMascota = async (id) => (await api.get(`/mascotas/${id}`)).data;
const createMascota = async (mascota) => (await api.post('/mascotas', mascota)).data;
const updateMascota = async (id, mascota) => (await api.put(`/mascotas/${id}`, mascota)).data;
const deleteMascota = async (id) => (await api.delete(`/mascotas/${id}`)).data;

const mascotaService = { getMascotas, getMascota, createMascota, updateMascota, deleteMascota };

export default mascotaService;
