import api from '../config/api';

const register = async (userData) => (await api.post('/auth/register', userData)).data;
const login = async (credentials) => (await api.post('/auth/login', credentials)).data;
const loginAdmin = async (credentials) => (await api.post('/auth/login/admin', credentials)).data;

const authService = { register, login, loginAdmin };

export default authService;
