import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { CartProvider } from './context/CartContext';
import theme from './theme';

import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
// import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductoDetallePage from './pages/ProductoDetallePage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import CarritoPage from './pages/CarritoPage';
import CheckoutPage from './pages/CheckoutPage';
import FavoritosPage from './pages/FavoritosPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminRoute from './components/AdminRoute';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import BoletaPage from './pages/BoletaPage';
import MisComprasPage from './pages/MisComprasPage';
import MisBoletasPage from './pages/MisBoletasPage';
import MascotasPage from './pages/MascotasPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CartProvider>
          <CssBaseline />
          <Navbar />
          <Box component="main" sx={{ p: 3, mt: '64px' }}> {/* Add margin top to avoid content being hidden behind a fixed Navbar */}
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:id" element={<ProductoDetallePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pedido-confirmado/:pedidoId" element={<OrderConfirmationPage />} />
          <Route path="/boleta/:id" element={<BoletaPage />} />
          <Route path="/mis-compras" element={<MisComprasPage />} />
          <Route path="/mis-boletas" element={<MisBoletasPage />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
          <Route path="/mascotas" element={<MascotasPage />} />

          {/* Admin Routes with Admin Theme */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/productos" element={<AdminRoute><AdminLayout><ProductManagementPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/usuarios" element={<AdminRoute><AdminLayout><UserManagementPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/pedidos" element={<AdminRoute><AdminLayout><OrderManagementPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/reportes" element={<AdminRoute><AdminLayout><ReportsPage /></AdminLayout></AdminRoute>} />
            <Route path="/admin/configuracion" element={<AdminRoute><AdminLayout><SettingsPage /></AdminLayout></AdminRoute>} />


            {/* Add other routes here */}
          </Routes>
        </Box>
        <Chatbot />
        {/* <Footer /> */}
      </CartProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;