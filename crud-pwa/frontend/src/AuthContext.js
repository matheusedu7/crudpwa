import React, { createContext, useState } from 'react';

// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para fazer login e alterar o estado de autenticação
  const login = () => {
    setIsAuthenticated(true);
  };

  // Função para fazer logout e alterar o estado de autenticação
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
