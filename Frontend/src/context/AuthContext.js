import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          // The structure of your user object should be consistent
          // In this case, we are reconstructing it from the token
          const user_role = decodedToken.role; // Simplified claim name
          const user_name = decodedToken.name; // Use the standard JWT claim name


          setUser({
            token: token,
            name: user_name,
            role: user_role
          });
        } else {
          // Token is expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Error decoding token from localStorage", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (userData) => {
    const token = userData.token;
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);

    // Extract claims - the names depend on what you configured in the backend's TokenService
    const user_role = decodedToken.role; // Simplified claim name
    const user_name = decodedToken.name; // Use the standard JWT claim name


    setUser({
      token: token,
      name: user_name,
      role: user_role
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};