import axios from 'axios';

const API_URL = 'http://localhost:5288/api/carrito';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
};

export const getCart = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error.response?.data?.message || error.message);
        throw error;
    }
};

export const addToCart = async (productoId, cantidad) => {
    try {
        const response = await axios.post(`${API_URL}/items`, { productoId, cantidad }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error.response?.data?.message || error.message);
        throw error;
    }
};


export const updateCartItem = async (productoId, cantidad) => {
    try {
        const response = await axios.put(`${API_URL}/items/${productoId}`, cantidad, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error.response?.data?.message || error.message);
        throw error;
    }
};

export const removeFromCart = async (productoId) => {
    try {
        const response = await axios.delete(`${API_URL}/items/${productoId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error.response?.data?.message || error.message);
        throw error;
    }
};