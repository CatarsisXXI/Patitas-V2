import axios from 'axios';

const API_URL = 'http://localhost:5288/api/pedidos'; // La URL base del controlador de Pedidos


const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
    const token = getToken();
    if (!token) return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const crearPedido = async (pedidoData) => {
  const response = await axios.post(API_URL, pedidoData, getAuthHeaders());
  return response.data;
};




const getPedidoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error fetching order with id ${id}:`, error);
        throw error;
    }
};

const getPedidos = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

const pedidoService = {
    crearPedido,
    getPedidoById,
    getPedidos,
};

export default pedidoService;