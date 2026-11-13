import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { errorMessage } from '../../config/api';
import { splitNombre } from '../../lib/productCopy';

/**
 * Acciones de compra compartidas por tarjeta, vista rápida y detalle:
 * agregar al carrito y alternar favorito, con sus avisos y el caso sin sesión.
 */
export const useProductActions = (product) => {
  const { user, isCustomer } = useAuth();
  const { addProductToCart, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const askLogin = useCallback(
    (message) => notify(message, { severity: 'info', action: { label: 'Ingresar', onClick: () => navigate('/login', { state: { from: window.location.pathname } }) } }),
    [notify, navigate]
  );

  const addToCart = useCallback(
    async (cantidad = 1) => {
      if (!user) return askLogin('Inicia sesión para armar tu pedido.');
      if (!isCustomer) return notify('El carrito es solo para cuentas de cliente.', { severity: 'info' });
      if (!product || product.stock <= 0 || adding) return undefined;

      setAdding(true);
      try {
        await addProductToCart(product.productoID, cantidad);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1600);
        notify(`${splitNombre(product.nombre).titulo} está en tu carrito.`, { action: { label: 'Ver carrito', onClick: openCart } });
      } catch (error) {
        notify(errorMessage(error, 'No pudimos agregar el producto.'), { severity: 'error' });
      } finally {
        setAdding(false);
      }
      return undefined;
    },
    [user, isCustomer, product, adding, addProductToCart, askLogin, notify, openCart]
  );

  const favorite = !!product && isFavorite(product.productoID);

  const toggleFav = useCallback(async () => {
    if (!user) return askLogin('Inicia sesión para guardar favoritos.');
    if (!isCustomer) return undefined;
    try {
      const nowFavorite = await toggleFavorite(product.productoID);
      notify(nowFavorite ? 'Guardado en favoritos.' : 'Quitado de favoritos.', { severity: 'info', duration: 2200 });
    } catch (error) {
      notify(errorMessage(error, 'No pudimos actualizar tus favoritos.'), { severity: 'error' });
    }
    return undefined;
  }, [user, isCustomer, product, toggleFavorite, askLogin, notify]);

  return { addToCart, adding, justAdded, favorite, toggleFav };
};
