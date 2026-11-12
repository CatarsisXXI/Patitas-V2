import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../services/cartService';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

const EMPTY_CART = { items: [], total: 0 };

export const CartProvider = ({ children }) => {
  const { isCustomer } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(isCustomer);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Se incrementa en cada "agregar" para animar el contador del navbar.
  const [pulse, setPulse] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      setCart(await getCart());
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // El carrito vive en el servidor y pertenece al cliente autenticado:
  // se carga al iniciar sesión y se descarta al cerrarla.
  useEffect(() => {
    if (isCustomer) {
      setLoading(true);
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
      setDrawerOpen(false);
    }
  }, [isCustomer, fetchCart]);

  const addProductToCart = useCallback(
    async (productoId, cantidad = 1) => {
      await addToCart(productoId, cantidad);
      await fetchCart();
      setPulse((n) => n + 1);
    },
    [fetchCart]
  );

  const updateProductQuantity = useCallback(
    async (productoId, cantidad) => {
      await updateCartItem(productoId, cantidad);
      await fetchCart();
    },
    [fetchCart]
  );

  const removeProductFromCart = useCallback(
    async (productoId) => {
      await removeFromCart(productoId);
      await fetchCart();
    },
    [fetchCart]
  );

  const clearCart = useCallback(() => setCart(EMPTY_CART), []);
  const openCart = useCallback(() => setDrawerOpen(true), []);
  const closeCart = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(() => {
    const items = cart?.items || [];
    return {
      cart,
      items,
      total: cart?.total || 0,
      itemCount: items.reduce((sum, item) => sum + item.cantidad, 0),
      loading,
      pulse,
      drawerOpen,
      openCart,
      closeCart,
      fetchCart,
      addProductToCart,
      updateProductQuantity,
      removeProductFromCart,
      clearCart,
    };
  }, [cart, loading, pulse, drawerOpen, openCart, closeCart, fetchCart, addProductToCart, updateProductQuantity, removeProductFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
