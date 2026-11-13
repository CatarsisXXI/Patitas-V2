import api from '../config/api';

const crearPedido = async (pedidoData) => (await api.post('/pedidos', pedidoData)).data;
const getPedidoById = async (id) => (await api.get(`/pedidos/${id}`)).data;
const getPedidos = async () => (await api.get('/pedidos')).data;

/** Convierte el carrito actual en un pedido "Pendiente" (flujo de compra por WhatsApp). */
const createPendingOrder = async () => (await api.post('/pedidos/pending', {})).data;

const pedidoService = { crearPedido, getPedidoById, getPedidos, createPendingOrder };

export default pedidoService;
