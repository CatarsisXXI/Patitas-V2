import { render, screen } from '@testing-library/react';
import App from './App';
import productService from './services/productService';

jest.mock('./services/productService', () => ({
  __esModule: true,
  default: { getProductos: jest.fn(), getCategorias: jest.fn(), getProductoById: jest.fn() },
}));

const PRODUCTOS = [
  { productoID: 1, nombre: 'Bocaditos Digest Fit (Plátano y Cúrcuma)', descripcion: 'Perfil del producto: Suaves.', precio: 18.9, stock: 24, categoriaNombre: 'Snacks para Perro', imagenURL: '/images/products/a.png', activo: true },
  { productoID: 2, nombre: 'Galletas Yacon Light (Calabaza, Yacón y Pollo)', descripcion: '', precio: 23, stock: 0, categoriaNombre: 'Snacks para Perro', imagenURL: null, activo: true },
];

const visit = (path) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('pys:bienvenida', '1');
  productService.getProductos.mockResolvedValue(PRODUCTOS);
  productService.getCategorias.mockResolvedValue([{ categoriaID: 1, nombre: 'Snacks para Perro' }]);
});

test('la portada muestra el titular y los productos que devuelve la API', async () => {
  visit('/');

  expect(screen.getByRole('heading', { level: 1, name: /amor natural en cada bocado/i })).toBeInTheDocument();
  expect(await screen.findByRole('link', { name: 'Bocaditos Digest Fit' })).toHaveAttribute('href', '/productos/1');
  expect(screen.getByRole('button', { name: /galletas yacon light agotado/i })).toBeDisabled();
});

test('la portada avisa y permite reintentar si la API falla', async () => {
  productService.getProductos.mockRejectedValue(new Error('sin conexión'));
  visit('/');

  expect(await screen.findByText(/no pudimos cargar los productos/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
});

test('una ruta desconocida muestra la página 404', async () => {
  visit('/no-existe');

  expect(await screen.findByRole('heading', { name: /esta página se nos escapó/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/');
});

test('el carrito pide iniciar sesión cuando no hay una sesión activa', async () => {
  visit('/carrito');

  expect(await screen.findByRole('heading', { name: /qué bueno verte de nuevo/i })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});

test('el panel de administración no es accesible sin sesión', async () => {
  visit('/admin');

  expect(await screen.findByLabelText(/correo o usuario/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});
