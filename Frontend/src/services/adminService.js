import axios from 'axios';

const API_URL = 'http://localhost:5288/api/admin';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No auth token found");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const getPedidos = async () => {
    try {
        const response = await axios.get(`${API_URL}/pedidos`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching orders for admin:", error);
        throw error;
    }
};

const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching users for admin:", error);
        throw error;
    }
};

const getDashboardStats = async () => {

    try {
        const response = await axios.get(`${API_URL}/estadisticas`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await axios.put(`${API_URL}/pedidos/${orderId}/estado`, JSON.stringify(newStatus), {
            ...getAuthHeaders(),
            headers: {
                ...getAuthHeaders().headers,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

const updateOrderAddress = async (orderId, newAddress) => {
    try {
        const response = await axios.put(`${API_URL}/pedidos/${orderId}/direccion`, JSON.stringify(newAddress), {
            ...getAuthHeaders(),
            headers: {
                ...getAuthHeaders().headers,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating order address:", error);
        throw error;
    }
};

const adminService = {
    getPedidos,
    getUsers,
    getDashboardStats,
    updateOrderStatus,
    updateOrderAddress,
};


export default adminService;