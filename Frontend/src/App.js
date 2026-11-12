import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MotionConfig } from 'framer-motion';
import theme from './theme/theme';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import StoreLayout from './components/layout/StoreLayout';
import AuthLayout from './components/layout/AuthLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import { RequireAdmin, RequireAuth } from './components/layout/RouteGuards';
import HomePage from './pages/HomePage';

// La portada va en el paquete inicial; el resto se descarga al visitarlo.
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductoDetallePage = lazy(() => import('./pages/ProductoDetallePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegistroPage = lazy(() => import('./pages/RegistroPage'));
const CarritoPage = lazy(() => import('./pages/CarritoPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const BoletaPage = lazy(() => import('./pages/BoletaPage'));
const MisComprasPage = lazy(() => import('./pages/MisComprasPage'));
const MisBoletasPage = lazy(() => import('./pages/MisBoletasPage'));
const FavoritosPage = lazy(() => import('./pages/FavoritosPage'));
const MascotasPage = lazy(() => import('./pages/MascotasPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductManagementPage = lazy(() => import('./pages/admin/ProductManagementPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const OrderManagementPage = lazy(() => import('./pages/admin/OrderManagementPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

const priv = (element) => <RequireAuth>{element}</RequireAuth>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* reducedMotion="user": si el sistema pide menos movimiento, se omiten los desplazamientos. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  <ScrollToTop />
                  <Routes>
                    <Route element={<StoreLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/productos" element={<ProductsPage />} />
                      <Route path="/productos/:id" element={<ProductoDetallePage />} />
                      <Route path="/carrito" element={priv(<CarritoPage />)} />
                      <Route path="/checkout" element={priv(<CheckoutPage />)} />
                      <Route path="/pedido-confirmado/:pedidoId" element={priv(<OrderConfirmationPage />)} />
                      <Route path="/boleta/:id" element={priv(<BoletaPage />)} />
                      <Route path="/mis-compras" element={priv(<MisComprasPage />)} />
                      <Route path="/mis-boletas" element={priv(<MisBoletasPage />)} />
                      <Route path="/favoritos" element={priv(<FavoritosPage />)} />
                      <Route path="/mascotas" element={priv(<MascotasPage />)} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/registro" element={<RegistroPage />} />
                    </Route>

                    <Route
                      path="/admin"
                      element={
                        <RequireAdmin>
                          <React.Suspense fallback={null}>
                            <AdminLayout />
                          </React.Suspense>
                        </RequireAdmin>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="productos" element={<ProductManagementPage />} />
                      <Route path="pedidos" element={<OrderManagementPage />} />
                      <Route path="usuarios" element={<UserManagementPage />} />
                      <Route path="reportes" element={<ReportsPage />} />
                      <Route path="configuracion" element={<SettingsPage />} />
                    </Route>
                  </Routes>
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
