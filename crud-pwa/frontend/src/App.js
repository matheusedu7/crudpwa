import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Products from './Products';
import { AuthContext, AuthProvider } from './AuthContext';
import './App.css';

function App() {
  const { isAuthenticated } = useContext(AuthContext); 

  return (
    <Router>
      <div className="app-container"> {}
        <h1>Meu Projeto</h1>
        <Routes>
          {/* Rota de Registro */}
          <Route path="/register" element={<Register />} />

          {/* Rota de Login */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/products" /> : <Login />} />

          {/* Rota de Produtos */}
          <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />

          {/* Redireciona para o login se a rota não for encontrada */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
