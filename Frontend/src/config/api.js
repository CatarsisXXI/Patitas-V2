import axios from 'axios';

// URL del backend. Se define en .env (REACT_APP_API_URL); por defecto apunta al
// perfil "http" de launchSettings.json del proyecto .NET.
export const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5288').replace(/\/+$/, '');

export const TOKEN_KEY = 'token';
export const SESSION_EXPIRED_EVENT = 'pys:sesion-expirada';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

const api = axios.create({ baseURL: `${API_ORIGIN}/api` });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthCall = (error.config?.url || '').startsWith('/auth/');
    // Un 401 fuera del login significa que el token venció o fue revocado.
    if (status === 401 && !isAuthCall && getToken()) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

/**
 * Convierte la ruta de imagen que devuelve la API ("/images/products/x.png",
 * "images/products/x.png" o una URL completa) en una URL utilizable.
 */
export const assetUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  const value = path.trim();
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
  return `${API_ORIGIN}/${value.replace(/^\/+/, '')}`;
};

/** Mensaje legible a partir de un error de axios. */
export const errorMessage = (error, fallback = 'Algo salió mal. Inténtalo de nuevo.') => {
  if (!error?.response) return 'No pudimos conectar con el servidor. Revisa tu conexión.';
  const data = error.response.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  return fallback;
};

export default api;
