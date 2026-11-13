import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import favoritoService from '../services/favoritoService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { isCustomer } = useAuth();
  const [favorites, setFavorites] = useState([]); // solo IDs, para consultas rápidas
  const [loading, setLoading] = useState(isCustomer);

  useEffect(() => {
    let cancelled = false;
    if (!isCustomer) {
      setFavorites([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    favoritoService
      .getFavoritos()
      .then((data) => !cancelled && setFavorites(data.map((p) => p.productoID)))
      .catch(() => !cancelled && setFavorites([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isCustomer]);

  /**
   * Alterna el favorito de forma optimista y revierte si la API falla.
   * @returns {Promise<boolean>} true si el producto quedó como favorito.
   */
  const toggleFavorite = useCallback(
    async (productoId) => {
      const wasFavorite = favorites.includes(productoId);
      setFavorites((prev) => (wasFavorite ? prev.filter((id) => id !== productoId) : [...prev, productoId]));
      try {
        if (wasFavorite) await favoritoService.removeFavorito(productoId);
        else await favoritoService.addFavorito(productoId);
        return !wasFavorite;
      } catch (error) {
        setFavorites((prev) => (wasFavorite ? [...new Set([...prev, productoId])] : prev.filter((id) => id !== productoId)));
        throw error;
      }
    },
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      loading,
      favoritesCount: favorites.length,
      isFavorite: (productoId) => favorites.includes(productoId),
      toggleFavorite,
    }),
    [favorites, loading, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
