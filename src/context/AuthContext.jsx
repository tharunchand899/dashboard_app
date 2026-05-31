import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('wanderlog_token') || null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wanderlog_theme') || 'light';
  });

  // Global search query for Navbar search input
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthenticated = !!token;

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wanderlog_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('wanderlog_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setSearchQuery(''); // clear search on logout
    localStorage.removeItem('wanderlog_token');
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated, 
      login, 
      logout, 
      theme, 
      toggleTheme,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
