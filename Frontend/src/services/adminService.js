import api from '../config/api';

const json = { headers: { 'Content-Type': 'application/json' } };

const getPedidos = async () => (await api.get('/admin/pedidos')).data;
const getUsers = async () => (await api.get('/admin/users')).data;
const getDashboardStats = async () => (await api.get('/admin/estadisticas')).data;

const updateOrderStatus = async (orderId, newStatus) =>
  (await api.put(`/admin/pedidos/${orderId}/estado`, { nuevoEstado: newStatus }, json)).data;

// El endpoint recibe la dirección como string JSON plano.
const updateOrderAddress = async (orderId, newAddress) =>
  (await api.put(`/admin/pedidos/${orderId}/direccion`, JSON.stringify(newAddress), json)).data;

const adminService = { getPedidos, getUsers, getDashboardStats, updateOrderStatus, updateOrderAddress };

export default adminService;
