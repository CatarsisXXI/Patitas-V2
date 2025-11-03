import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getCart, addToCart, removeFromCart, updateCartItem } from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = useCallback(async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [fetchCart]);

    const addProductToCart = async (productoId, cantidad) => {
        try {
            await addToCart(productoId, cantidad);
            fetchCart();
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

    const updateProductQuantity = async (productoId, cantidad) => {
        try {
            await updateCartItem(productoId, cantidad);
            fetchCart();
        } catch (error) {
            console.error("Failed to update cart item quantity", error);
            throw error; // Re-throw to handle in component
        }
    };

    const removeProductFromCart = async (productoId) => {
        try {
            await removeFromCart(productoId);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    const clearCart = () => {
        setCart(null);
    };

    return (
        <CartContext.Provider value={{ cart, loading, addProductToCart, updateProductQuantity, removeProductFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};