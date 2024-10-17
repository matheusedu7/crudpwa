import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            login();
            navigate('/products');
        } catch (error) {
            console.error('Erro no login', error.response ? error.response.data : error.message);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>

            {/* Mensagem e botão de registro */}
            <div className="register-section">
                <p>Ainda não tem conta?</p>
                <button onClick={handleRegisterRedirect}>Registrar</button>
            </div>
        </div>
    );
};

export default Login;
