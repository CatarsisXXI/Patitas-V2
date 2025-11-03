import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import favoritoService from '../services/favoritoService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await favoritoService.getFavoritos();
      setFavorites(data.map(p => p.productoID)); // Guardamos solo los IDs para una búsqueda rápida
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (productoId) => {
    const isFavorite = favorites.includes(productoId);
    try {
      if (isFavorite) {
        await favoritoService.removeFavorito(productoId);
        setFavorites(prev => prev.filter(id => id !== productoId));
      } else {
        await favoritoService.addFavorito(productoId);
        setFavorites(prev => [...prev, productoId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert local state if backend call fails
      if (isFavorite) {
        setFavorites(prev => [...prev, productoId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== productoId));
      }
    }
  };

  const isFavorite = (productoId) => favorites.includes(productoId);

  const favoritesCount = favorites.length;

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    loading,
    favoritesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};