import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Products from './Products';
import { AuthContext, AuthProvider } from './AuthContext'; // Importando o contexto de autenticação
import './App.css'; // Importando o CSS

function App() {
  const { isAuthenticated } = useContext(AuthContext); // Obtém o estado de autenticação do contexto

  return (
    <Router>
      <div className="app-container"> {/* Aplicando a classe CSS */}
        <h1>Meu Projeto</h1>
        <Routes>
          {/* Rota de Registro */}
          <Route path="/register" element={<Register />} />

          {/* Rota de Login */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/products" /> : <Login />} />

          {/* Rota de Produtos (Protegida) */}
          <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />

          {/* Redireciona para o login se a rota não for encontrada */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Envolvendo o App com o AuthProvider para fornecer o contexto de autenticação
export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
