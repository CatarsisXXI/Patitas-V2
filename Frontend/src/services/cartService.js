import api from '../config/api';

export const getCart = async () => (await api.get('/carrito')).data;

export const addToCart = async (productoId, cantidad) =>
  (await api.post('/carrito/items', { productoId, cantidad })).data;

// El endpoint espera el número como cuerpo JSON plano, no un objeto.
export const updateCartItem = async (productoId, cantidad) =>
  (await api.put(`/carrito/items/${productoId}`, cantidad, { headers: { 'Content-Type': 'application/json' } })).data;

export const removeFromCart = async (productoId) => (await api.delete(`/carrito/items/${productoId}`)).data;
