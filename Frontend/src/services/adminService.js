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

const adminService = {
    getPedidos,
    getUsers,
    getDashboardStats,
};


export default adminService;