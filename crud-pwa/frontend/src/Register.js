import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        console.log({ name, email, password });
        try {
            const response = await axios.post('http://localhost:8080/register', { name, email, password });
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error('Erro no registro', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h2>Registrar</h2>
            <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <button onClick={handleRegister}>Registrar</button>
        </div>
    );
};

export default Register;
