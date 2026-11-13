import api from '../config/api';

const getFavoritos = async () => (await api.get('/favoritos')).data;
const addFavorito = async (productoId) => (await api.post(`/favoritos/${productoId}`, {})).data;
const removeFavorito = async (productoId) => (await api.delete(`/favoritos/${productoId}`)).data;

const favoritoService = { getFavoritos, addFavorito, removeFavorito };

export default favoritoService;
