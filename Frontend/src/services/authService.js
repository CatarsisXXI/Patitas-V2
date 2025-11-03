import axios from 'axios';

export const getToken = () => localStorage.getItem('token');

const API_URL = 'http://localhost:5288/api/auth'; // Adjust port if necessary


const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const registerAdmin = async (adminData) => {
  const response = await axios.post(`${API_URL}/register/admin`, adminData);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  // The backend should return user info and a JWT token
  if (response.data.token) {
    // Store the token securely in localStorage
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const loginAdmin = async (credentials) => {
  const response = await axios.post(`${API_URL}/login/admin`, credentials);
  // The backend should return user info and a JWT token
  if (response.data.token) {
    // Store the token securely in localStorage
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const authService = {
  register,
  registerAdmin,
  login,
  loginAdmin,
};

export default authService;