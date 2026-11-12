import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { SESSION_EXPIRED_EVENT, TOKEN_KEY } from '../config/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

const userFromToken = (token) => {
  if (!token) return null;
  try {
    const claims = jwtDecode(token);
    if (!claims.exp || claims.exp * 1000 <= Date.now()) return null;
    const name = claims.name || claims.unique_name || '';
    return {
      token,
      name,
      firstName: name.trim().split(/\s+/)[0] || '',
      role: claims.role || claims[ROLE_CLAIM] || 'Cliente',
    };
  } catch {
    return null;
  }
};

const readStoredUser = () => {
  const user = userFromToken(localStorage.getItem(TOKEN_KEY));
  if (!user) localStorage.removeItem(TOKEN_KEY);
  return user;
};

export const AuthProvider = ({ children }) => {
  // Lectura síncrona: evita que las rutas protegidas redirijan al recargar la página.
  const [user, setUser] = useState(readStoredUser);
  const { notify } = useToast();

  const login = useCallback((userData) => {
    const next = userFromToken(userData?.token);
    if (!next) throw new Error('Token inválido');
    localStorage.setItem(TOKEN_KEY, next.token);
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      logout();
      notify('Tu sesión expiró. Vuelve a iniciar sesión.', { severity: 'info' });
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [logout, notify]);

  const value = useMemo(
    () => ({ user, login, logout, isAdmin: user?.role === 'Admin', isCustomer: !!user && user.role !== 'Admin' }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
